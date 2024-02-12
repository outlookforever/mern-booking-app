export type Props = {
  page: number
  pages: number
  onPageChange: (page: number) => void
}

const Pagination = ({ page, pages, onPageChange }: Props) => {
  // TODO: Создать массив номеров страниц
  const pageNumbers = []
  for (let i = 1; i <= pages; i++) {
    pageNumbers.push(i)
  }

  return (
    <div className="flex justify-center">
      <ul className="flex border border-slate-300">
        {pageNumbers.map((numb) => (
          <li
            key={numb}
            className={`px-2 py-1 ${numb === page ? 'bg-gray-200' : ''}`}>
            <button onClick={() => onPageChange(numb)}>{numb}</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Pagination
