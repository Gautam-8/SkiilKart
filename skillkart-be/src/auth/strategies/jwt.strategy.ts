import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'skillkart',
    });
  }

  async validate(payload: any) {
    console.log('JWT Strategy - Validating payload:', payload);
    
    const user = await this.userRepository.findOne({
      where: { id: payload.sub },
    });
    
    console.log('JWT Strategy - Found user:', user ? { id: user.id, email: user.email, role: user.role } : 'NOT FOUND');
    
    if (!user) {
      console.log('JWT Strategy - User not found, throwing UnauthorizedException');
      throw new UnauthorizedException();
    }
    
    console.log('JWT Strategy - Returning user with role:', user.role);
    return user;
  }
} 