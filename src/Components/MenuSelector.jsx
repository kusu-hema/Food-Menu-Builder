function MenuSelector({ selected, onSelect }) {
    return (
      <div>
        <h2>Select Menu Category</h2>
        {['Tiffin', 'Lunch', 'Dinner'].map((cat) => (
          <button
            key={cat}
            onClick={() => onSelect(cat)}
            style={{
              margin: '5px',
              padding: '10px',
              background: selected === cat ? 'darkblue' : 'lightgray',
              color: selected === cat ? 'white' : 'black'
            }}
          >
            {cat}
          </button>
        ))}
      </div>
    );
  }
  
  export default MenuSelector;
  