import React, { createContext, useContext, useEffect, useState } from 'react';

const LoaderContext = createContext();

export function LoaderProvider({ children }) {
  const [loading, setLoading] = useState(false);
  return (
    <LoaderContext.Provider value={{ loading, setLoading }}>
      {children}
    </LoaderContext.Provider>
  );
}

export function useLoader() {
  return useContext(LoaderContext);
}

const ExamplePage = () => {
  const { loading, setLoading } = useLoader();
  const [data, setData] = useState([]);

  // Show loader on page load
  useEffect(() => {
    setLoading(true);
    fetch('/api/data')
      .then(res => res.json())
      .then(json => setData(json))
      .finally(() => setLoading(false));
  }, [setLoading]);

  // Show loader on button click
  const handleAction = async () => {
    setLoading(true);
    await someAsyncAction();
    setLoading(false);
  };

  return (
    <div>
      {loading && <div>Loading...</div>}
      <button onClick={handleAction} disabled={loading}>
        Do Action
      </button>
      {/* ...rest of your page... */}
    </div>
  );
};

export default ExamplePage;