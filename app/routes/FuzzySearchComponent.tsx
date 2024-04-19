import React, { useState, useEffect } from 'react';
import Fuse from 'fuse.js';
import { Link } from 'react-router-dom';

function FuzzySearchComponent({ data }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showList, setShowList] = useState(true);

  useEffect(() => {
    const fuse = new Fuse(data.map(name => ({ name })), {
      keys: ['name'],
      includeScore: true,
      threshold: 0.4,
    });
    
    const results = fuse.search(searchQuery);
    setFilteredData(results.map(result => result.item));
  }, [data, searchQuery]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setSelectedItem(null); // Reset selected item when search query changes
    setShowList(true); // Show filtered list when search query changes
  };

  const handleItemClick = (item) => {
    setSelectedItem(item);
    setSearchQuery(item.name); // Set selected item as search query
    setShowList(false); // Hide filtered list when an item is selected
  };

  return (
    <div className='absolute top-2 right-2 '>
      <input
        type="text"
        placeholder={selectedItem ? selectedItem.name : "Search..."}
        value={searchQuery}
        onChange={handleSearchChange}
        className='w-80 rounded-md h-8 p-2'
      />
      <Link to={`/search/product/${encodeURIComponent(selectedItem?.name)}`}>
        <button><img src="https://uxwing.com/wp-content/themes/uxwing/download/user-interface/search-icon.png" alt="" className='h-4 mx-2' /></button>
      </Link>
      {showList && (
        <ul className='bg-black my-1 rounded px-2'>
          {filteredData.map((item, index) => (
            <li key={index} onClick={() => handleItemClick(item)} style={{ cursor: 'pointer' }}>
              {item.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default FuzzySearchComponent;
