CREATE DATABASE dbStArt;
USE dbStArt;


CREATE TABLE tblEspecialidade (
  idEspecialidade INT NOT NULL AUTO_INCREMENT,
  nomeEspecialidade VARCHAR(100) NOT NULL,
  PRIMARY KEY (idEspecialidade),
  UNIQUE INDEX (idEspecialidade)
);


CREATE TABLE tblArtista (
  idArtista INT NOT NULL AUTO_INCREMENT,
  nomeCompleto VARCHAR(100) NOT NULL,
  nomeArtistico VARCHAR(100) NOT NULL,
  cpf_cnpj VARCHAR(20) NOT NULL,
  telefoneCelular VARCHAR(18) NOT NULL,
  dataNascimento DATE NOT NULL,
  biografia TEXT NULL,
  pais VARCHAR(60) NULL,
  nacionalidade VARCHAR(60) NULL,
  email VARCHAR(256) NOT NULL,
  senha TEXT NOT NULL,
  contaEstaAtiva TINYINT NOT NULL,
  eDestacado TINYINT NOT NULL,
  idEspecialidade INT NOT NULL,
  fotoPerfilArtista VARCHAR(250) NULL,
  PRIMARY KEY (idArtista),
  UNIQUE INDEX (idArtista),
    UNIQUE INDEX (email),
      UNIQUE INDEX (fotoPerfilArtista),
  CONSTRAINT fk_tblArtista_tblEspecialidade
    FOREIGN KEY (idEspecialidade)
    REFERENCES tblEspecialidade (idEspecialidade)
);


CREATE TABLE tblEstado (
  idEstado INT NOT NULL AUTO_INCREMENT,
  nomeEstado VARCHAR(70) NOT NULL,
  PRIMARY KEY (idEstado),
  UNIQUE INDEX (idEstado)
);


CREATE TABLE tblCidade (
  idCidade INT NOT NULL AUTO_INCREMENT,
  nomeCidade VARCHAR(70) NOT NULL,
  idEstado INT NOT NULL,
  PRIMARY KEY (idCidade),
  UNIQUE INDEX (idCidade),
  CONSTRAINT fk_tblCidade_tblEstado
    FOREIGN KEY (idEstado)
    REFERENCES tblEstado (idEstado)
);


CREATE TABLE tblEnderecoCliente (
  idEnderecoCliente INT NOT NULL AUTO_INCREMENT,
  rua VARCHAR(100) NOT NULL,
  cep VARCHAR(10) NOT NULL,
  complemento VARCHAR(30) NULL,
  bairro VARCHAR(100) NOT NULL,
  idCidade INT NOT NULL,
  PRIMARY KEY (idEnderecoCliente),
  UNIQUE INDEX (idEnderecoCliente),
  CONSTRAINT fk_tblEnderecoCliente_tblCidade
    FOREIGN KEY (idCidade)
    REFERENCES tblCidade (idCidade)
);



CREATE TABLE tblCliente (
  idCliente INT NOT NULL AUTO_INCREMENT,
  nomeCompleto VARCHAR(100) NOT NULL,
  dataNascimento DATE NOT NULL,
  telefoneCelular VARCHAR(18) NOT NULL,
  cpf_cnpj VARCHAR(20) NOT NULL,
  biografia TEXT NULL,
  pais VARCHAR(60) NULL,
  nacionalidade VARCHAR(60) NULL,
  preferencia VARCHAR(100) NULL,
  email VARCHAR(256) NOT NULL,
  senha TEXT NOT NULL,
  contaEstaAtiva TINYINT NOT NULL,
  idEnderecoCliente INT NOT NULL,
  fotoPerfilCliente VARCHAR(250) NULL,
  PRIMARY KEY (idCliente),
  UNIQUE INDEX (idCliente),
	UNIQUE INDEX (email),
      UNIQUE INDEX (fotoPerfilCliente),
  CONSTRAINT fk_tblCliente_tblEnderecoCliente
    FOREIGN KEY (idEnderecoCliente)
    REFERENCES tblEnderecoCliente (idEnderecoCliente)
);


CREATE TABLE tblAvaliacaoArtista (
  idAvaliacaoArtista INT NOT NULL AUTO_INCREMENT,
  avaliacaoArtista FLOAT NOT NULL,
  idArtista INT NOT NULL,
  tblCliente_idCliente INT NOT NULL,
  PRIMARY KEY (idAvaliacaoArtista),
  UNIQUE INDEX (idAvaliacaoArtista),
  CONSTRAINT fk_tblAvaliacaoArtista_tblArtista
    FOREIGN KEY (idArtista)
    REFERENCES tblArtista (idArtista),
  CONSTRAINT fk_tblAvaliacaoArtista_tblCliente
    FOREIGN KEY (tblCliente_idCliente)
    REFERENCES tblCliente (idCliente)
);



CREATE TABLE tblContaBancariaArtista (
  idContaBancariaArtista INT NOT NULL AUTO_INCREMENT,
  tipoConta VARCHAR(25) NOT NULL,
  banco VARCHAR(50) NOT NULL,
  titular VARCHAR(100) NOT NULL,
  cpfTitular VARCHAR(20) NOT NULL,
  agencia VARCHAR(10) NOT NULL,
  digito VARCHAR(5) NOT NULL,
  conta VARCHAR(15) NOT NULL,
  digitoVerificador VARCHAR(5) NOT NULL,
  idArtista INT NOT NULL,
  PRIMARY KEY (idContaBancariaArtista),
  UNIQUE INDEX (idContaBancariaArtista),
  CONSTRAINT fk_tblContaBancariaArtista_tblArtista
    FOREIGN KEY (idArtista)
    REFERENCES tblArtista (idArtista)
);


CREATE TABLE tblPixArtista (
  idPixArtista INT NOT NULL AUTO_INCREMENT,
  tipoChave VARCHAR(30) NOT NULL,
  chave VARCHAR(256) NOT NULL,
  idArtista INT NOT NULL,
  PRIMARY KEY (idPixArtista),
  UNIQUE INDEX (idPixArtista),
  CONSTRAINT fk_tblPixArtista_tblArtista1
    FOREIGN KEY (idArtista)
    REFERENCES tblArtista (idArtista)
);


CREATE TABLE tblCategoria (
  idCategoria INT NOT NULL AUTO_INCREMENT,
  nomeCategoria VARCHAR(100) NOT NULL,
  PRIMARY KEY (idCategoria),
  UNIQUE INDEX (idCategoria)
);


CREATE TABLE tblEspecialidadeCategoria (
  idEspecialidadeCategoria INT NOT NULL AUTO_INCREMENT,
  idEspecialidade INT NOT NULL,
  idCategoria INT NOT NULL,
  PRIMARY KEY (idEspecialidadeCategoria),
  UNIQUE INDEX (idEspecialidadeCategoria),
  CONSTRAINT fk_tblEspecialidadeCategoria_tblEspecialidade
    FOREIGN KEY (idEspecialidade)
    REFERENCES tblEspecialidade (idEspecialidade),
  CONSTRAINT fk_tblEspecialidadeCategoria_tblCategoria
    FOREIGN KEY (idCategoria)
    REFERENCES tblCategoria (idCategoria)
);


CREATE TABLE tblPedidoPersonalizado (
  idPedidoPersonalizado INT NOT NULL AUTO_INCREMENT,
  descricao VARCHAR(500) NOT NULL,
  genero VARCHAR(100) NOT NULL,
  status VARCHAR(15) NOT NULL,
  imagem1opcional TEXT NULL,
  imagem2opcional TEXT NULL,
  imagem3opcional TEXT NULL,
  idCliente INT NOT NULL,
  PRIMARY KEY (idPedidoPersonalizado),
  UNIQUE INDEX (idPedidoPersonalizado),
  CONSTRAINT fk_tblPedidoPersonalizado_tblCliente
    FOREIGN KEY (idCliente)
    REFERENCES tblCliente (idCliente)
);


CREATE TABLE tblObraPronta (
  idObraPronta INT NOT NULL AUTO_INCREMENT,
  nomeObra VARCHAR(100) NOT NULL,
  preco FLOAT NOT NULL,
  quantidade INT NOT NULL,
  tecnica VARCHAR(100) NOT NULL,
  desconto FLOAT NOT NULL,
  eExclusiva TINYINT NOT NULL,
  descricao VARCHAR(500) NOT NULL,
  imagem1obrigatoria TEXT NOT NULL,
  imagem2opcional TEXT NULL,
  imagem3opcional TEXT NULL,
  imagem4opcional TEXT NULL,
  imagem5opcional TEXT NULL,
  imagem6opcional TEXT NULL,
  idArtista INT NOT NULL,
  idEspecialidade INT NOT NULL,
  PRIMARY KEY (idObraPronta),
  UNIQUE INDEX (idObraPronta),
  CONSTRAINT fk_tblObraPronta_tblArtista
    FOREIGN KEY (idArtista)
    REFERENCES tblArtista (idArtista),
  CONSTRAINT fk_tblObraPronta_tblEspecialidade
    FOREIGN KEY (idEspecialidade)
    REFERENCES tblEspecialidade (idEspecialidade)
);


CREATE TABLE tblCompra (
  idCompra INT NOT NULL AUTO_INCREMENT,
  idCliente INT NOT NULL,
  idObraPronta INT NOT NULL,
  PRIMARY KEY (idCompra),
  UNIQUE INDEX (idCompra),
  CONSTRAINT fk_tblCompra_tblCliente
    FOREIGN KEY (idCliente)
    REFERENCES tblCliente (idCliente),
  CONSTRAINT fk_tblCompra_tblObraPronta
    FOREIGN KEY (idObraPronta)
    REFERENCES tblObraPronta (idObraPronta)
);


CREATE TABLE tblFormaPagto (
  idFormaPagto INT NOT NULL,
  formaPagto VARCHAR(20) NOT NULL,
  bandeiraCartao VARCHAR(30) NOT NULL,
  PRIMARY KEY (idFormaPagto)
);


CREATE TABLE tblPagamento (
  idPagamento INT NOT NULL AUTO_INCREMENT,
  valor FLOAT NOT NULL,
  data_hora DATETIME NOT NULL,
  idCompra INT NOT NULL,
  idFormaPagto INT NOT NULL,
  status VARCHAR(45) NOT NULL,
  PRIMARY KEY (idPagamento),
  UNIQUE INDEX (idPagamento),
CONSTRAINT fk_tblPagamento_tblCompra
	FOREIGN KEY (idCompra)
	REFERENCES tblCompra (idCompra),
  CONSTRAINT fk_tblPagamento_tblFormaPagto
	FOREIGN KEY (idFormaPagto)
	REFERENCES tblFormaPagto (idFormaPagto)
);


CREATE TABLE tblProposta (
  idtProposta INT NOT NULL AUTO_INCREMENT,
  descricao VARCHAR(500) NOT NULL,
  preco FLOAT NOT NULL,
  prazoEntrega DATE NOT NULL,
  status VARCHAR(15) NOT NULL,
  idArtista INT NOT NULL,
  idPedidoPersonalizado INT NOT NULL,
  idPagamento INT NOT NULL,
  PRIMARY KEY (idtProposta),
  UNIQUE INDEX (idtProposta),
  CONSTRAINT fk_tblProposta_tblArtista
	FOREIGN KEY (idArtista)
	REFERENCES tblArtista (idArtista),
  CONSTRAINT fk_tblProposta_tblPedidoPersonalizado
	FOREIGN KEY (idPedidoPersonalizado)
	REFERENCES tblPedidoPersonalizado (idPedidoPersonalizado),
  CONSTRAINT fk_tblProposta_tblPagamento
	FOREIGN KEY (idPagamento)
	REFERENCES tblPagamento (idPagamento)
);


CREATE TABLE tblAvaliacaoCliente (
  idAvaliacaoCliente INT NOT NULL AUTO_INCREMENT,
  avaliacaoCliente FLOAT NOT NULL,
  idCliente INT NOT NULL,
  idArtista INT NOT NULL,
  PRIMARY KEY (idAvaliacaoCliente),
  UNIQUE INDEX (idAvaliacaoCliente),
  CONSTRAINT fk_tblAvaliacaoCliente_tblCliente
	FOREIGN KEY (idCliente)
	REFERENCES tblCliente (idCliente),
  CONSTRAINT fk_tblAvaliacaoCliente_tblArtista
	FOREIGN KEY (idArtista)
	REFERENCES tblArtista (idArtista)
);


CREATE TABLE tblVisibilidadePedido (
  idVisibilidadePedido INT NOT NULL AUTO_INCREMENT,
  idPedidoPersonalizado INT NOT NULL,
  idArtista INT NULL,
  PRIMARY KEY (idVisibilidadePedido),
  UNIQUE INDEX (idVisibilidadePedido),
  CONSTRAINT fk_tblVisibilidadePedido_tblPedidoPersonalizado
	FOREIGN KEY (idPedidoPersonalizado)
	REFERENCES tblPedidoPersonalizado (idPedidoPersonalizado),
  CONSTRAINT fk_tblVisibilidadePedido_tblArtista
	FOREIGN KEY (idArtista)
	REFERENCES tblArtista (idArtista)
);


CREATE TABLE tblChat (
  idChat INT NOT NULL AUTO_INCREMENT,
  idArtista INT NOT NULL,
  idCliente INT NOT NULL,
  dataCriacao DATETIME NOT NULL,
  PRIMARY KEY (idChat),
  UNIQUE INDEX (idChat),
  CONSTRAINT fk_tblChat_tblArtista
	FOREIGN KEY (idArtista)
	REFERENCES tblArtista (idArtista),
  CONSTRAINT fk_tblChat_tblCliente
	FOREIGN KEY (idCliente)
	REFERENCES tblCliente (idCliente)
);


CREATE TABLE tblMensagem (
  idChat INT NOT NULL AUTO_INCREMENT,
  remetente INT NOT NULL,
  destinatario INT NOT NULL,
  mensagem TEXT NOT NULL,
  data_hora DATETIME NOT NULL,
  PRIMARY KEY (idChat),
  UNIQUE INDEX (idChat),
  CONSTRAINT fk_tblMensagem_tblChat
    FOREIGN KEY (idChat)
    REFERENCES tblChat (idChat)
);


CREATE TABLE tblDoacao (
  idDoacao INT NOT NULL AUTO_INCREMENT,
  idArtista INT NOT NULL,
  idCliente INT NOT NULL,
  valor FLOAT NOT NULL,
  idContaBancariaArtista INT NULL,
  idPixArtista INT NULL,
  PRIMARY KEY (idDoacao),
  UNIQUE INDEX (idDoacao),
  CONSTRAINT fk_tblDoacao_tblArtista
	FOREIGN KEY (idArtista)
	REFERENCES tblArtista (idArtista),
  CONSTRAINT fk_tblDoacao_tblCliente
	FOREIGN KEY (idCliente)
	REFERENCES tblCliente (idCliente),
  CONSTRAINT fk_tblDoacao_tblContaBancariaArtista
	FOREIGN KEY (idContaBancariaArtista)
	REFERENCES tblContaBancariaArtista (idContaBancariaArtista),
  CONSTRAINT fk_tblDoacao_tblPixArtista
	FOREIGN KEY (idPixArtista)
	REFERENCES tblPixArtista (idPixArtista)
);


CREATE TABLE tblAdministrador (
  idAdministrador INT NOT NULL AUTO_INCREMENT,
  login VARCHAR(256) NOT NULL,
  senha TEXT NOT NULL,
  PRIMARY KEY (idAdministrador),
  UNIQUE INDEX (idAdministrador)
);



CREATE TABLE tblObraFavorita (
  idObrasFavoritas INT NOT NULL AUTO_INCREMENT,
  idObraPronta INT NOT NULL,
  idCliente INT NOT NULL,
  PRIMARY KEY (idObrasFavoritas),
  UNIQUE INDEX (idObrasFavoritas),
  CONSTRAINT fk_tblObrasFavoritas_tblObraPronta
    FOREIGN KEY (idObraPronta)
    REFERENCES tblObraPronta (idObraPronta),
  CONSTRAINT fk_tblObrasFavoritas_tblCliente
    FOREIGN KEY (idCliente)
    REFERENCES tblCliente (idCliente)
);

