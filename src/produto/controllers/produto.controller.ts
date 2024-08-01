import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseFloatPipe,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { Produto } from '../entities/produto.entity';
import { ProdutoService } from '../services/produto.service';
import { JwtAuthGuard } from '../../auth/guard/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('/produtos')
export class ProdutoController {
  constructor(private readonly produtoService: ProdutoService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(): Promise<Produto[]> {
    return this.produtoService.findAll();
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  findById(@Param('id', ParseIntPipe) id: number): Promise<Produto> {
    return this.produtoService.findById(id);
  }

  @Get('/nome/:nome')
  @HttpCode(HttpStatus.OK)
  findByNome(@Param('nome') nome: string): Promise<Produto[]> {
    return this.produtoService.findByNome(nome);
  }

  @Get('/maior/:preco')
  @HttpCode(HttpStatus.OK)
  findByPrecoMaior(
    @Param('preco', ParseFloatPipe) preco: number,
  ): Promise<Produto[]> {
    return this.produtoService.findByPrecoMaior(preco);
  }

  @Get('/menor/:preco')
  @HttpCode(HttpStatus.OK)
  findByPrecoMenor(
    @Param('preco', ParseFloatPipe) preco: number,
  ): Promise<Produto[]> {
    return this.produtoService.findByPrecoMenor(preco);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() postagem: Produto): Promise<Produto> {
    return this.produtoService.create(postagem);
  }

  @Put()
  @HttpCode(HttpStatus.OK)
  update(@Body() postagem: Produto): Promise<Produto> {
    return this.produtoService.update(postagem);
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.produtoService.delete(id);
  }
}
