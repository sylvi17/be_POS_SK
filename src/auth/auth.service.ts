
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { User } from "@prisma/client";
import { StringValue } from "ms";

import { PrismaService } from "../prisma/prisma.service";
import { LoginDto } from "./dto/login.dto";
import { AUTH } from "./auth.constants";
import { AuthenticatedUser } from "../common/interfaces/authenticated-user.interface";

const WITH_ROLE_PERMISSIONS = {
  role: {
    include: {
      permissionRoles: {
        include: {
          permission: true,
        },
      },
    },
  },
} as const;

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Login menggunakan username dan password.
   */
  async login(dto: LoginDto) {
    const username = dto.username?.trim();
    const password = dto.password;

    if (!username || !password) {
      throw new UnauthorizedException(AUTH.INVALID_CREDENTIALS);
    }

    const user = await this.prisma.user.findUnique({
      where: { username },
      include: WITH_ROLE_PERMISSIONS,
    });

    // Username tidak ditemukan.
    if (!user) {
      console.warn(
        `Login gagal: username "${username}" tidak ditemukan.`,
      );

      throw new UnauthorizedException(AUTH.INVALID_CREDENTIALS);
    }

    // Akun tidak aktif.
    if (!user.is_active) {
      console.warn(
        `Login gagal: akun "${username}" tidak aktif.`,
      );

      throw new UnauthorizedException(AUTH.INVALID_CREDENTIALS);
    }

    // Verifikasi password terhadap hash bcrypt.
    const isPasswordValid = await bcrypt.compare(
      password,
      user.password,
    );

    if (!isPasswordValid) {
      console.warn(
        `Login gagal: password untuk "${username}" tidak cocok.`,
      );

      throw new UnauthorizedException(AUTH.INVALID_CREDENTIALS);
    }

    // Buat access token dan refresh token.
    const [accessToken, refreshToken] = await Promise.all([
      this.generateAccessToken(user),
      this.generateRefreshToken(user),
    ]);

    // Simpan waktu login dan hash refresh token.
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        last_login_at: new Date(),
        refresh_token: await bcrypt.hash(refreshToken, 10),
      },
    });

    // Kembalikan user lengkap untuk diproses oleh controller.
    // Controller harus menghapus password dan refresh_token
    // sebelum mengirim data user ke client.
    return {
      user,
      accessToken,
      refreshToken,
    };
  }

  /**
   * Membuat access token baru menggunakan refresh token.
   */
  async refreshToken(token: string) {
    if (!token) {
      throw new UnauthorizedException(AUTH.INVALID_REFRESH_TOKEN);
    }

    let payload: { sub: number };

    try {
      payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_REFRESH_SECRET,
      });
    } catch {
      throw new UnauthorizedException(AUTH.INVALID_REFRESH_TOKEN);
    }

    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      include: WITH_ROLE_PERMISSIONS,
    });

    if (!user || !user.is_active || !user.refresh_token) {
      throw new UnauthorizedException(AUTH.INVALID_REFRESH_TOKEN);
    }

    const isTokenValid = await bcrypt.compare(
      token,
      user.refresh_token,
    );

    if (!isTokenValid) {
      await this.revokeRefreshToken(user.id);

      throw new UnauthorizedException(
        AUTH.REFRESH_TOKEN_REUSE_DETECTED,
      );
    }

    const [accessToken, refreshToken] = await Promise.all([
      this.generateAccessToken(user),
      this.generateRefreshToken(user),
    ]);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        refresh_token: await bcrypt.hash(refreshToken, 10),
      },
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  /**
   * Logout dengan mencabut refresh token.
   */
  async logout(userId: number): Promise<void> {
    await this.revokeRefreshToken(userId);
  }

  /**
   * Mengambil data user yang terautentikasi.
   */
  async validateUser(userId: number): Promise<AuthenticatedUser> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: WITH_ROLE_PERMISSIONS,
    });

    if (!user || !user.is_active) {
      throw new UnauthorizedException(AUTH.USER_NOT_FOUND);
    }

    return user;
  }

  /**
   * Membuat access token.
   */
  private generateAccessToken(user: User): Promise<string> {
    return this.jwtService.signAsync(
      {
        sub: user.id,
        username: user.username,
      },
      {
        secret: process.env.JWT_SECRET,
        expiresIn: (process.env.JWT_ACCESS_EXPIRES_IN ??
          "15m") as StringValue,
      },
    );
  }

  /**
   * Membuat refresh token.
   */
  private generateRefreshToken(user: User): Promise<string> {
    return this.jwtService.signAsync(
      {
        sub: user.id,
      },
      {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: (process.env.JWT_REFRESH_EXPIRES_IN ??
          "30d") as StringValue,
      },
    );
  }

  /**
   * Mencabut refresh token dari database.
   */
  private async revokeRefreshToken(userId: number): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        refresh_token: null,
      },
    });
  }
}
