export class Content {
  private readonly content: string;

  //declaração do valor que vou utilizar metodo GETTERS

  get value(): string {
    return this.content;
  }

  //criação da validação da regra que eu quero inserir
  //regra: 
  //validar o tamanho de dados a serem inseridos 

  private validationContentLength(content: string): boolean {
    return content.length>= 5 && content.length <=240;
  }

  constructor(content: string) {
    //ao inves de fazer a validação dentro do IF fazer ela separado para ver melhor o codigo.
    const isContentLengthValid = this.validationContentLength(content)

    if (!isContentLengthValid) {
      throw new Error('Content length error');
    }
    this.content = content
  }
}

