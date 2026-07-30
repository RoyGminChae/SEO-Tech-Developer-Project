import { useState } from 'react'

const mockBooks = [
    {id: 'book-1',
    title: 'Eloquent JavaScript',
    author: 'Marijn Haverbeke',
    },
    {
        id: 'book-2',
        title: 'JavaScript: The Good Parts',
        author: 'Douglas Crockford',
    },
    {
        id: 'book-3',
        title: 'You Don’t Know JS Yet',
        author: 'Kyle Simpson',
    },
]

function SearchBooks(){
    const [search, setSearch] = useState("");
    const [books, setBooks] = useState([]);

    const [selectedBooks, setSelectedBooks] = useState([]);

    const [studyPlan, setStudyPlan] = useState("")
    const [savedMessage, setsavedMessage] = useState('')

    async function searchBooks() {
        console.log("Search Clicked");
        try {
            const response = await fetch(
                `http://localhost:8000/books?keyword=${encodeURIComponent(search)}`
            );

            const data = await response.json();

            setBooks(data);
        } catch(error) {
            console.error(error);
        }
    }

    function toggleBook(book) {
        const isAlreadySelected = selectedBooks.some(
            (selectedBook) => selectedBook.title === book.title
        )

        if (isAlreadySelected) {
            setSelectedBooks(
            selectedBooks.filter((selectedBook) => selectedBook.title !== book.title)
            );
            } else {
            setSelectedBooks([...selectedBooks, book])
            }
        }
    
    async function generateStudyPlan(){
        const response = await fetch(
            "http://localhost:8000/plans/new",
            {
                method: "POST",
                headers: {
                    "Content-Type":"application/json"
                },
                body: JSON.stringify(selectedBooks)
            }
        );
        const text = await response.text();
        setStudyPlan(text);
    }

    async function saveStudyPlan(){
        try {
            const response = await fetch(
                "http://localhost:8000/plans/save",
                {
                    method:"POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        text: studyPlan,
                    }),
                }
            );

            if (!response.ok){
                throw new Error("Failed to save study plan");
            }

            setsavedMessage("Study Plan Saved");
        } catch(error){
            console.error("Error saving study plan:", error);
        }
    }

    return (
        <>
        <h2>Search Topics to Study For:</h2>
        <input type="text"
            placeholder="Enter study topic"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="primary-input"
        />

        <button className="primary-button" onClick={searchBooks}>
            Search
        </button>

        {books.length > 0 && (
            <div >
                <h3>Suggested Books</h3>

                {books.map((book) => {
                    const isSelected = selectedBooks.some(
                        (selectedBook) => selectedBook.title === book.title)

                return (
                    <label className={`book-result ${isSelected ? 'selected' : ''}`}
                key={`${book.title}-${book.authors[0]}`}>
                <input  type="checkbox"
                checked={isSelected}
                onChange={() => toggleBook(book)}/>

                <div>
                    <h4>{book.title}</h4>
                    <p>By {book.authors.join(", ")}</p>
                </div>
            </label>
            )
        })}

            {books.length > 0 && (
                <p className="selection-count">
                {selectedBooks.length} book(s) selected
                </p>
            )}
        </div>
        )}

        <button
        className = "primary-button"
        onClick={generateStudyPlan}
        disabled={selectedBooks.length === 0}>
            Generate Study Plan
        </button>

        {studyPlan && (
            <section className='study-plan'>
                <h3>
                    Your Study Plan
                </h3>

                <div className='study-plan-text'>
                    {studyPlan.split("\n").map((line,index)=> (
                        line.trim() !== "" && <p key={index}>{line}</p>
                    ))}
                </div>

                <button className='primary-button'
                onClick={saveStudyPlan}>
                    Save study plan
                </button>

                {savedMessage && (
                    <p className='save-message'>{savedMessage}</p>
                )}
            </section>
        )}
        </>
    );
}

export default SearchBooks;


/*laber for="books">Type Here</laber>
        <input type="books"></input>
*/
