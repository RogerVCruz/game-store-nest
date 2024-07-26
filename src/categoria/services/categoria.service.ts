import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DeleteResult, ILike, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Categoria } from '../entities/categoria.entity';

@Injectable()
export class CategoriaService {
  constructor(
    @InjectRepository(Categoria)
    private categoriaRepository: Repository<Categoria>,
  ) {}

  async findAll(): Promise<Categoria[]> {
    return await this.categoriaRepository.find({
      relations: { produto: true },
    });
  }

  async findById(id: number): Promise<Categoria> {
    const buscaCategoria = await this.categoriaRepository.findOne({
      where: {
        id,
      },
      relations: { produto: true },
    });

    if (!buscaCategoria)
      throw new HttpException(
        'O Categoria não foi encontrado!',
        HttpStatus.NOT_FOUND,
      );

    return buscaCategoria;
  }

  async findByDescricao(descricao: string): Promise<Categoria[]> {
    return await this.categoriaRepository.find({
      where: {
        descricao: ILike(`%${descricao}%`),
      },
      relations: { produto: true },
    });
  }

  async create(categoria: Categoria): Promise<Categoria> {
    return await this.categoriaRepository.save(categoria);
  }

  async update(categoria: Categoria): Promise<Categoria> {
    const buscaCategoria = await this.findById(categoria.id);

    if (!categoria.id)
      throw new HttpException(
        'O Categoria não foi encontrado!',
        HttpStatus.NOT_FOUND,
      );

    return await this.categoriaRepository.save(categoria);
  }

  async delete(id: number): Promise<DeleteResult> {
    const buscaCategoria = await this.findById(id);

    if (!buscaCategoria)
      throw new HttpException(
        'O Categoria não foi encontrado!',
        HttpStatus.NOT_FOUND,
      );

    return await this.categoriaRepository.delete(id);
  }
}
