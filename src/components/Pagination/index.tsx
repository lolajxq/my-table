import "./index.css";

interface Props {
  current: number;
  size: number;
  total: number;
  onChange: (size: number, current: number) => void;
}

const Pagination = ({ size, total, onChange, current }: Props) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(total / size); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="pagination">
      {pageNumbers.map((number) => (
        <div
          key={number}
          className={`page-item ${current === number ? "active" : ""}`}
          onClick={() => onChange(size, number)}
        >
          {number}
        </div>
      ))}

      <select
        value={size}
        onChange={(e) => onChange(Number(e.target.value), current)}
      >
        <option value={0} disabled>
          请输入页面大小
        </option>
        <option value={5}>5</option>
        <option value={10}>10</option>
        <option value={20}>20</option>
        <option value={30}>30</option>
        <option value={50}>50</option>
        <option value={100}>100</option>
      </select>
    </div>
  );
};

export { Pagination };
