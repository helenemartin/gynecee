import React, { useState, useEffect } from "react";
import BooksContainer from "./components/booksContainer";
import Header from "./components/Header";
import DetailPanel from "./components/DetailPanel";
import Search from "./components/Search";
import { GlobalStyle } from "./styles";
import { Transition } from "react-transition-group";

const App = () => {
  const [books, setBooks] = useState([]);
  const [selectedBooks, setSelectedBooks] = useState(null);
  const [showPanel, setShowPanel] = useState(false);
  const [filteredBooks, setFilteredBooks] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        "https://book-club-json.herokuapp.com/books"
      );
      const books = await response.json();
      setBooks(books);
      setFilteredBooks(books);
    };

    fetchData();
  }, []);

  console.log(`hehehehe:`, books);

  const pickBook = (book) => {
    setSelectedBooks(book);
    setShowPanel(true);
  };

  const closePanel = () => {
    setShowPanel(false);
  };

  const filterBooks = (searchTerm) => {
    const stringSearch = (bookAttribute, searchTerm) =>
      bookAttribute.toLowerCase().includes(searchTerm.toLowerCase());

    if (!searchTerm) {
      setFilteredBooks(books);
    } else {
      setFilteredBooks(
        books.filter(
          (book) =>
            stringSearch(book.title, searchTerm) ||
            stringSearch(book.author, searchTerm)
        )
      );
    }
  };

  const hasFiltered = filteredBooks.length !== books.length;
  return (
    <>
      <GlobalStyle />
      <Header>
        <Search filterBooks={filterBooks} />
      </Header>
      <BooksContainer
        books={filteredBooks}
        pickBook={pickBook}
        isPanelOpen={showPanel}
        title={hasFiltered ? "Search results" : "All books"}
      />
      <Transition in={showPanel} timeout={300}>
        {(state) => (
          <DetailPanel
            book={selectedBooks}
            closePanel={closePanel}
            state={state}
          />
        )}
      </Transition>
    </>
  );
};

export default App;
