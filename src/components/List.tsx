export interface ListProps {
  name?: string;
  list?: string[];
}

const List = ({ name, list }: ListProps) => {
  let listItems;
  if (list) {
    listItems = list.map((item) => <li key={item}>{item}</li>);
  }

  return (
    <>
      <div>
        <div className="text-xl font-semibold mb-4">{name}</div>
        {listItems && <ul className="list-disc pl-6 space-y-2">{listItems}</ul>}
      </div>
    </>
  );
};

export default List;
