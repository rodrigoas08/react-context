import { createContext, useContext, useState, useEffect, useMemo } from "react";
import { usePagamentoContext } from "./Pagamento";
import { UsuarioContext } from "./Usuario";

export const CarrinhoContext = createContext();
CarrinhoContext.displayName = "Carrinho";

export const CarrinhoProvider = ({ children }) => {
	const [carrinho, setCarrinho] = useState([]);
	const [quantidadeProdutos, setQuantidadeProdutos] = useState(0);
	const [valorTotalCarrinho, setValorTotalCarrinho] = useState(0);

	return (
		<CarrinhoContext.Provider
			value={{
				carrinho,
				setCarrinho,
				quantidadeProdutos,
				setQuantidadeProdutos,
				valorTotalCarrinho,
				setValorTotalCarrinho,
			}}
		>
			{children}
		</CarrinhoContext.Provider>
	);
};

export const useCarrinhoContext = () => {
	const {
		carrinho,
		setCarrinho,
		quantidadeProdutos,
		setQuantidadeProdutos,
		valorTotalCarrinho,
		setValorTotalCarrinho,
	} = useContext(CarrinhoContext);
	const { saldo, setSaldo } = useContext(UsuarioContext);
	const { formaPagamento } = usePagamentoContext();

	function mudarQuantidade(id, quantidade) {
		return carrinho.map((itemDoCarrinho) => {
			if (itemDoCarrinho.id === id) itemDoCarrinho.quantidade += quantidade;
			return itemDoCarrinho;
		});
	}

	function AdicionarProduto(novoProduto) {
		const temOproduto = carrinho.some(
			(itemDoCarrinho) => itemDoCarrinho.id === novoProduto.id
		);

		if (!temOproduto) {
			novoProduto.quantidade = 1;
			return setCarrinho((carrinhoAnterior) => [
				...carrinhoAnterior,
				novoProduto,
			]);
		}
		setCarrinho(mudarQuantidade(novoProduto.id, 1));
	}

	function removerProduto(id) {
		const produto = carrinho.find((itemDoCarrinho) => itemDoCarrinho.id === id);
		const ehUltimo = produto?.quantidade === 1;
		if (ehUltimo) {
			return setCarrinho((carrinhoAnterior) =>
				carrinhoAnterior.filter((itemDoCarrinho) => itemDoCarrinho.id !== id)
			);
		}
		setCarrinho(mudarQuantidade(id, -1));
	}

	const saldoTotal = useMemo(
		() => saldo - valorTotalCarrinho,
		[saldo, valorTotalCarrinho]
	);

	function efetuarCompra() {
		setCarrinho([]);
		setSaldo((saldoAtual) => saldoAtual - valorTotalCarrinho);
	}

	useEffect(() => {
		const { novoTotal, novaQuantidade } = carrinho.reduce(
			(contador, produto) => ({
				novaQuantidade: contador.novaQuantidade + produto.quantidade,
				novoTotal: contador.novoTotal + produto.valor * produto.quantidade,
			}),
			{ novaQuantidade: 0, novoTotal: 0 }
		);
		setQuantidadeProdutos(novaQuantidade);
		setValorTotalCarrinho(novoTotal * formaPagamento.juros);
	}, [carrinho, setQuantidadeProdutos, setValorTotalCarrinho, formaPagamento]);

	return {
		carrinho,
		setCarrinho,
		AdicionarProduto,
		removerProduto,
		quantidadeProdutos,
		setQuantidadeProdutos,
		valorTotalCarrinho,
		saldoTotal,
		efetuarCompra,
	};
};
