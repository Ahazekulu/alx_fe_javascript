const quotes = [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
    { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", category: "Success" },
    { text: "In the middle of every difficulty lies opportunity.", category: "Inspiration" }
];

function showRandomQuote() {
    if (quotes.length === 0) {
        document.getElementById("quoteDisplay").innerHTML = "<p>No quotes available.</p>";
        return;
    }
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quoteDisplay = document.getElementById("quoteDisplay");

    quoteDisplay.innerHTML = `<p>"${quotes[randomIndex].text}"</p>
                              <p><strong>Category:</strong> ${quotes[randomIndex].category}</p>`;
}

function createAddQuoteForm() {
    const formContainer = document.createElement("div");
    formContainer.innerHTML = `
        <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
        <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
        <button id="addQuoteButton">Add Quote</button>
    `;
    document.body.appendChild(formContainer);
    
    document.getElementById("addQuoteButton").addEventListener("click", addQuote);
}

function addQuote() {
    const quoteText = document.getElementById("newQuoteText").value.trim();
    const quoteCategory = document.getElementById("newQuoteCategory").value.trim();

    if (quoteText === "" || quoteCategory === "") {
        alert("Please enter both a quote and a category.");
        return;
    }

    const newQuote = { text: quoteText, category: quoteCategory };
    quotes.push(newQuote);

    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";

    document.getElementById("quoteDisplay").innerHTML = `<p>"${newQuote.text}"</p>
                                                          <p><strong>Category:</strong> ${newQuote.category}</p>`;
}

// Ensure event listener is attached to the "Show New Quote" button
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("newQuote").addEventListener("click", showRandomQuote);
    createAddQuoteForm(); // Create the form dynamically
    showRandomQuote(); // Show an initial random quote on page load
});
