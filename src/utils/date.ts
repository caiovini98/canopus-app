const hoje = new Date();
const ano = hoje.getFullYear();
const mes = (hoje.getMonth() + 1).toString().padStart(2, "0");
const dia = hoje.getDate().toString().padStart(2, "0");
const dataAtual = `${ano}-${mes}-${dia}`;

export function convertDate(date: string) {
  const partesData = date.split("-");
  const ano = partesData[0];
  const mes = partesData[1];
  const dia = partesData[2];

  return `${dia}/${mes}/${ano}`;
}

export function convertDateToInputDate(date: string) {
  const hoje = new Date();
  const ano = hoje.getFullYear();
  const mes = (hoje.getMonth() + 1).toString().padStart(2, "0");
  const dia = hoje.getDate().toString().padStart(2, "0");

  return `${ano}-${mes}-${dia}`;
}

export default dataAtual;
