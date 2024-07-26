import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DeleteResult, ILike, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Produto } from '../entities/produto.entity';
import { CategoriaService } from '../../categoria/services/categoria.service';

@Injectable()
export class ProdutoService {
  constructor(
    @InjectRepository(Produto)
    private produtoRepository: Repository<Produto>,
    private categoriaService: CategoriaService,
  ) {}

  async findAll(): Promise<Produto[]> {
    return await this.produtoRepository.find({
      relations: {
        categoria: true,
      },
    });
  }

  async findById(id: number): Promise<Produto> {
    const buscaProduto = await this.produtoRepository.findOne({
      where: {
        id,
      },
    });

    if (!buscaProduto)
      throw new HttpException(
        'Produto não foi encontrado',
        HttpStatus.NOT_FOUND,
      );

    return buscaProduto;
  }

  async findByNome(nome: string): Promise<Produto[]> {
    return await this.produtoRepository.find({
      where: {
        nome: ILike(`%${nome}%`),
      },
    });
  }

  async create(produto: Produto): Promise<Produto> {
    if (produto.categoria) {
      await this.categoriaService.findById(produto.categoria.id);
    }
    return await this.produtoRepository.save(produto);
  }

  async update(produto: Produto): Promise<Produto> {
    const buscaProduto = await this.findById(produto.id);

    if (produto.categoria) {
      await this.categoriaService.findById(produto.categoria.id);

      return await this.produtoRepository.save(produto);
    }

    return await this.produtoRepository.save(produto);
  }

  async delete(id: number): Promise<DeleteResult> {
    const buscaProduto = await this.findById(id);

    return await this.produtoRepository.delete(id);
  }
}
