import { useState } from "react";
import "./App.css";
import { Table } from "./components";

function App() {
  const [fixed, setFixed] = useState({ left: 1, right: 2 });

  const columns = [
    { dataIndex: "name", title: "Name", sortable: true },
    { dataIndex: "age", title: "Age", sortable: true },
    { dataIndex: "address", title: "Address", sortable: true },
    { dataIndex: "sex", title: "Sex", sortable: true },
    { dataIndex: "height", title: "Height", sortable: true },
    { dataIndex: "job", title: "Job", sortable: true },
    { dataIndex: "email", title: "Email", sortable: true },
    { dataIndex: "phone", title: "Phone", sortable: true },
    { dataIndex: "company", title: "Company", sortable: true },
    { dataIndex: "country", title: "Country", sortable: true },
  ];

  const data = Array.from({ length: 100 }, (_, i) => ({
    name: `Person ${i + 1}`,
    age: Math.floor(Math.random() * 60) + 18,
    address: `City ${i + 1}`,
    sex: i % 2 == 1 ? "male" : "female",
    height: Math.floor(Math.random() * 60),
    job: `Job ${i + 1}`,
    email: `person${i + 1}@example.com`,
    phone: `123-456-78${i}`,
    company: `Company ${i + 1}`,
    country: `Country ${i + 1}`,
  }));

  return (
    <div className="App">
      <div>
        左边固定
        <input
          type="number"
          min={0}
          value={fixed.left}
          onChange={(e) =>
            setFixed({ ...fixed, left: Math.floor(Number(e.target.value)) })
          }
        />
        列
      </div>
      <div>
        右边边固定
        <input
          type="number"
          min={0}
          value={fixed.right}
          onChange={(e) =>
            setFixed({ ...fixed, right: Math.floor(Number(e.target.value)) })
          }
        />
        列
      </div>

      <Table
        columns={columns}
        data={data}
        fixed={fixed}
        pagination={{ current: 1, size: 10, total: data.length }}
        style={{ width: 700, height: 600 }}
      />
    </div>
  );
}

export default App;
