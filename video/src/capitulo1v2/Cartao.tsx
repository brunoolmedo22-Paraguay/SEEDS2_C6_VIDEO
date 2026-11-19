// Cartão de recurso no estilo do nó da PLANTA (ícone oficial em quadro tingido + rótulo da tecnologia + nome + valor +
// detalhe), sem a moldura de interface: só tipografia e cor de informação. A TAG de inventário NÃO é exibida
// (a TAG gravada «FV-C6-406MWP» é resto de rascunho — docs/VERIFICACAO_DADOS.md §7).
import { ICONE, Tipo } from "../capitulo1/Passo1Sistema";
import { COR, FONTE } from "../tema";

export const Cartao: React.FC<{ x: number; y: number; tipo: Tipo; cor: string; rotulo: string; nome: string; valor: React.ReactNode; sub: React.ReactNode;
  op: number; escala?: number; desloc?: number }> = ({ x, y, tipo, cor, rotulo, nome, valor, sub, op, escala = 1, desloc = 0 }) => {
  const T = 104;
  return (
    <g opacity={op} transform={`translate(${x + desloc}, ${y}) scale(${escala})`}>
      <rect x={0} y={0} width={T} height={T} rx={24} fill={cor} fillOpacity={0.15} stroke={cor} strokeOpacity={0.35} strokeWidth={1.5} />
      <svg x={T / 2 - 32} y={T / 2 - 32} width={64} height={64} viewBox="0 0 32 32" style={{ color: cor }} overflow="visible">{ICONE[tipo]}</svg>
      <g transform={`translate(${T + 30}, 0)`}>
        <text y={20} fontFamily={FONTE.titulo} fontWeight={700} fontSize={19} letterSpacing="0.1em" fill={cor}>{rotulo}</text>
        <text y={52} fontFamily={FONTE.titulo} fontWeight={600} fontSize={26} fill={COR.tinta2}>{nome}</text>
        <text y={112} fontFamily={FONTE.titulo} fontWeight={600} fontSize={60} fill={COR.tinta}>{valor}</text>
        <text y={150} fontFamily={FONTE.texto} fontSize={25} fill={COR.tinta2}>{sub}</text>
      </g>
    </g>
  );
};
