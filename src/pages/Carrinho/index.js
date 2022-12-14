import {
	Button,
	Snackbar,
	InputLabel,
	Select,
	MenuItem,
} from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";
import { useCarrinhoContext } from "common/context/Carrinho";
import Produto from "components/Produto";
import { useContext, useState } from "react";
import {
	Container,
	Voltar,
	TotalContainer,
	PagamentoContainer,
} from "./styles";
import { useHistory } from "react-router-dom";
import { usePagamentoContext } from "common/context/Pagamento";
import { UsuarioContext } from "common/context/Usuario";

function Carrinho() {
	const [openSnackbar, setOpenSnackbar] = useState(false);
	const { saldo = 0 } = useContext(UsuarioContext);
	const {
		carrinho,
		valorTotalCarrinho,
		saldoTotal,
		quantidadeProdutos,
		efetuarCompra,
	} = useCarrinhoContext();
	const { formaPagamento, mudarFormaPagamento, tiposPagamento } =
		usePagamentoContext();
	const history = useHistory();

	return (
		<Container>
			<Voltar onClick={() => history.goBack()} />
			<h2>Carrinho</h2>
			{carrinho.map((produto) => (
				<Produto {...produto} key={produto.id} />
			))}
			<PagamentoContainer>
				<InputLabel> Forma de Pagamento </InputLabel>
				<Select
					value={formaPagamento.id}
					onChange={(event) => mudarFormaPagamento(event.target.value)}
				>
					{tiposPagamento.map((pagamento) => (
						<MenuItem key={pagamento.id} value={pagamento.id}>
							{pagamento.nome}
						</MenuItem>
					))}
				</Select>
			</PagamentoContainer>
			<TotalContainer>
				<div>
					<h2>Total no Carrinho: </h2>
					<span>R$ {valorTotalCarrinho.toFixed(2)}</span>
				</div>
				<div>
					<h2> Saldo: </h2>
					<span> R$ {Number(saldo).toFixed(2)}</span>
				</div>
				<div>
					<h2> Saldo Total: </h2>
					<span> R$ {saldoTotal.toFixed(2)}</span>
				</div>
			</TotalContainer>
			<Button
				onClick={() => {
					setOpenSnackbar(true);
					efetuarCompra();
				}}
				disabled={saldoTotal < 0 || !quantidadeProdutos}
				color="primary"
				variant="contained"
			>
				Comprar
			</Button>
			<Snackbar
				anchorOrigin={{
					vertical: "top",
					horizontal: "right",
				}}
				open={openSnackbar}
				onClose={() => setOpenSnackbar(false)}
			>
				<MuiAlert onClose={() => setOpenSnackbar(false)} severity="success">
					Compra feita com sucesso!
				</MuiAlert>
			</Snackbar>
		</Container>
	);
}

export default Carrinho;
