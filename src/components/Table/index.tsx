import { CSSProperties, useEffect, useState } from "react";
import { Pagination } from "../Pagination";
import "./index.css";

type Sort = "NONE" | "ASCENDING" | "DESCENDING";

interface Column {
  title: string;
  dataIndex: string;
  sortable: boolean;
  sort?: Sort;
}

type paginationType = {
  current: number;
  size: number;
  total: number;
};
type Attr = { [key: string]: string | number };

interface Props {
  columns: Column[];
  data: Attr[];
  fixed: { left: number; right: number };
  pagination?: paginationType;
  style?: CSSProperties;
}

const Table = (props: Props) => {
  const {
    columns: cols,
    data: list,
    fixed,
    pagination: paginationProps,
    style,
  } = props;
  console.log({ list });

  const [columns, setColumns] = useState<Column[]>([]);
  const [data, setData] = useState<Attr[]>([]);
  const [pagination, setPagination] = useState<paginationType>();

  const handleScroll = () => {
    const rightList = [];
    const tdList = document.getElementsByClassName("fixed");

    for (let element of tdList) {
      const index = Number(element.className.split("-")[1]);

      // 计算并设置left
      if (index >= 0 && index < fixed.left) {
        let left = 0;
        const beforeDom = document.getElementsByClassName(
          `fixed-${index - 1}`
        )[0];

        if (beforeDom) {
          const {
            left: beforeLeft,
            width,
            padding,
            borderWidth,
          } = window.getComputedStyle(beforeDom);
          left +=
            Number(beforeLeft.split("px")[0]) +
            Number(width.split("px")[0]) +
            Number(padding.split("px")[0]) * 2;
        }

        (element as HTMLElement).style.left = left + "px";
      }

      // 将右边的元素存入数组，用于后续倒着遍历设置right
      if (index < columns.length && index >= columns.length - fixed.right) {
        rightList.push(element);
      }
    }

    // 计算并设置right
    for (let i = rightList.length - 1; i >= 0; i--) {
      const index = Number(rightList[i].className.split("-")[1]);
      let right = 0;
      const afterDom = document.getElementsByClassName(`fixed-${index + 1}`)[
        Math.floor(i / fixed.right)
      ];

      if (afterDom) {
        const {
          right: afterRight,
          width,
          padding,
        } = window.getComputedStyle(afterDom);
        right +=
          Number(afterRight.split("px")[0]) +
          Number(width.split("px")[0]) +
          Number(padding.split("px")[0]) * 2;
      }
      (rightList[i] as HTMLElement).style.right = right + "px";
    }
  };

  useEffect(() => {
    const tableDom = document.getElementById("table-container");

    tableDom?.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      tableDom?.removeEventListener("scroll", handleScroll);
    };
  }, [fixed.left, fixed.right]);

  useEffect(() => {
    handleScroll();
  }, [pagination?.current, pagination?.size, fixed.left, fixed.right]);

  useEffect(() => {
    if (cols?.length) {
      setColumns(cols.map((c) => ({ ...c, sort: "NONE" })));
    }
  }, [cols]);

  const getNewData = (current: number, size: number) => {
    const start = (current - 1) * size;
    const end = start + size;

    return list.slice(start, end);
  };

  useEffect(() => {
    if (list?.length) {
      if (pagination) {
        setData(getNewData(pagination.current, pagination.size));
      } else {
        setData(list);
      }
    }
  }, [list]);

  useEffect(() => {
    if (paginationProps) {
      setPagination(paginationProps);
    }
  }, [paginationProps]);

  const sortArr = (
    array: Attr[],
    dataIndex: string,
    ascending: boolean = true
  ) => {
    return array.sort((aObj, bObj) => {
      const a = aObj[dataIndex];
      const b = bObj[dataIndex];

      if (typeof a === "number" && typeof b === "number") {
        return ascending ? a - b : b - a;
      } else if (typeof a === "string" && typeof b === "string") {
        return ascending ? a.localeCompare(b) : b.localeCompare(a);
      } else {
        return 0;
      }
    });
  };

  const handleSort = (sort: Sort, dataIndex: string) => {
    switch (sort) {
      case "NONE":
        setColumns(
          columns.map((col) => {
            if (col.dataIndex === dataIndex) {
              return { ...col, sort: "ASCENDING" };
            }
            return col;
          })
        );
        setData(sortArr(data, dataIndex, true));
        break;
      case "ASCENDING":
        setColumns(
          columns.map((col) => {
            if (col.dataIndex === dataIndex) {
              return { ...col, sort: "DESCENDING" };
            }
            return col;
          })
        );
        setData(sortArr(data, dataIndex, false));
        break;
      case "DESCENDING":
        setColumns(
          columns.map((col) => {
            if (col.dataIndex === dataIndex) {
              return { ...col, sort: "NONE" };
            }
            return col;
          })
        );
        setData(list);
        break;
      default:
        break;
    }
  };

  const isFixed = (index: number) => {
    const { left, right } = fixed;
    return index < left || index >= columns.length - right;
  };

  const getSortIcon = (type: Sort) => {
    const iconPath = {
      NONE: (
        <path d="M137.4 41.4c12.5-12.5 32.8-12.5 45.3 0l128 128c9.2 9.2 11.9 22.9 6.9 34.9s-16.6 19.8-29.6 19.8L32 224c-12.9 0-24.6-7.8-29.6-19.8s-2.2-25.7 6.9-34.9l128-128zm0 429.3l-128-128c-9.2-9.2-11.9-22.9-6.9-34.9s16.6-19.8 29.6-19.8l256 0c12.9 0 24.6 7.8 29.6 19.8s2.2 25.7-6.9 34.9l-128 128c-12.5 12.5-32.8 12.5-45.3 0z" />
      ),
      ASCENDING: (
        <path d="M182.6 41.4c-12.5-12.5-32.8-12.5-45.3 0l-128 128c-9.2 9.2-11.9 22.9-6.9 34.9s16.6 19.8 29.6 19.8l256 0c12.9 0 24.6-7.8 29.6-19.8s2.2-25.7-6.9-34.9l-128-128z" />
      ),
      DESCENDING: (
        <path d="M182.6 470.6c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-9.2-9.2-11.9-22.9-6.9-34.9s16.6-19.8 29.6-19.8l256 0c12.9 0 24.6 7.8 29.6 19.8s2.2 25.7-6.9 34.9l-128 128z" />
      ),
    };

    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={10}
        height={10}
        fill={type === "NONE" ? "#ccc" : "red"}
        viewBox="0 0 320 512"
      >
        {iconPath[type]}
      </svg>
    );
  };

  const handlePageChange = (size: number, current: number) => {
    setPagination({ ...(pagination as paginationType), size, current });
    setData(getNewData(current, size));
  };

  return (
    <>
      <div id="table-container" style={style}>
        <table className="table">
          <thead>
            <tr>
              {columns.map((c, i) => (
                <th
                  key={c.title}
                  className={isFixed(i) ? `fixed fixed-${i}` : ""}
                >
                  {c.title}
                  {c.sortable && (
                    <span
                      onClick={() => handleSort(c.sort as Sort, c.dataIndex)}
                    >
                      {getSortIcon(c.sort as Sort)}
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, idx) => {
              const row = [];

              for (const key in item) {
                row.push(item[key]);
              }

              return (
                <tr key={idx}>
                  {row.map((d, i) => (
                    <td
                      key={i}
                      className={isFixed(i) ? `fixed  fixed-${i}` : ""}
                    >
                      {d}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {pagination && (
        <div className="page-tool">
          <Pagination {...pagination} onChange={handlePageChange} />
        </div>
      )}
    </>
  );
};

export { Table };
