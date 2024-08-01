import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from '../entities/usuario.entity';
import { Bcrypt } from '../../auth/bcrypt/bcrypt';
import * as moment from 'moment';
import parseDate from '../../utils/parseDate/parseDate';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
    private bcrypt: Bcrypt,
  ) {}

  async findByUsuario(usuario: string): Promise<Usuario | undefined> {
    return await this.usuarioRepository.findOne({
      where: {
        usuario: usuario,
      },
    });
  }

  async findAll(): Promise<Usuario[]> {
    return await this.usuarioRepository.find({
      relations: {
        produto: true,
      },
    });
  }

  async findById(id: number): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findOne({
      where: {
        id,
      },
      relations: {
        produto: true,
      },
    });

    if (!usuario)
      throw new HttpException('Usuario não encontrado!', HttpStatus.NOT_FOUND);

    return usuario;
  }

  async create(usuario: Usuario): Promise<Usuario> {
    const buscaUsuario = await this.findByUsuario(usuario.usuario);

    if (!buscaUsuario) {
      usuario.senha = await this.bcrypt.criptografarSenha(usuario.senha);

      usuario.dataNascimento = parseDate(usuario.dataNascimento);

      return await this.usuarioRepository.save(usuario);
    }

    throw new HttpException('O Usuario ja existe!', HttpStatus.BAD_REQUEST);
  }

  async update(usuario: Usuario): Promise<Usuario> {
    const updateUsuario: Usuario = await this.findById(usuario.id);
    const buscaUsuario = await this.findByUsuario(usuario.usuario);

    this.verificaIdadeUsuario(usuario.dataNascimento);

    usuario.dataNascimento = parseDate(usuario.dataNascimento);

    if (buscaUsuario.usuario !== usuario.usuario)
      throw new HttpException(
        'Usuário (e-mail) incorreto!',
        HttpStatus.BAD_REQUEST,
      );

    if (buscaUsuario && buscaUsuario.id !== usuario.id)
      throw new HttpException(
        'Usuário (e-mail) já Cadastrado!',
        HttpStatus.BAD_REQUEST,
      );

    usuario.senha = await this.bcrypt.criptografarSenha(usuario.senha);
    return await this.usuarioRepository.save(usuario);
  }

  verificaIdadeUsuario(dataNascimento: Date) {
    const idade = moment(Date.now()).diff(dataNascimento, 'years');
    if (idade < 18)
      throw new HttpException(
        'Usuário menor de idade!',
        HttpStatus.BAD_REQUEST,
      );
  }
}
