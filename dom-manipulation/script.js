const quotes = JSON.parse(localStorage.getItem("quotes")) || [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
    { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", category: "Success" },
    { text: "In the middle of every difficulty lies opportunity.", category: "Inspiration" }
];

function showRandomQuote() {
    const selectedCategory = localStorage.getItem("selectedCategory") || "all";
    const filteredQuotes = selectedCategory === "all" ? quotes : quotes.filter(q => q.category === selectedCategory);
    
    if (filteredQuotes.length === 0) {
        document.getElementById("quoteDisplay").innerHTML = "<p>No quotes available in this category.</p>";
        return;
    }
    
    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    const quoteDisplay = document.getElementById("quoteDisplay");
    
    quoteDisplay.innerHTML = `<p>"${filteredQuotes[randomIndex].text}"</p>
                              <p><strong>Category:</strong> ${filteredQuotes[randomIndex].category}</p>`;
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
    localStorage.setItem("quotes", JSON.stringify(quotes));
    populateCategories();

    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";

    // Show the newly added quote immediately
    document.getElementById("quoteDisplay").innerHTML = `<p>"${newQuote.text}"</p>
                                                          <p><strong>Category:</strong> ${newQuote.category}</p>`;
}

function populateCategories() {
    const categoryFilter = document.getElementById("categoryFilter");
    categoryFilter.innerHTML = '<option value="all">All Categories</option>';
    
    const categories = [...new Set(quotes.map(q => q.category))];
    categories.forEach(category => {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });
    
    categoryFilter.value = localStorage.getItem("selectedCategory") || "all";
}

function filterQuotes() {
    const selectedCategory = document.getElementById("categoryFilter").value;
    localStorage.setItem("selectedCategory", selectedCategory);
    showRandomQuote();
}

document.addEventListener("DOMContentLoaded", () => {
    document.body.insertAdjacentHTML("beforeend", '<select id="categoryFilter" onchange="filterQuotes()"></select>');
    document.getElementById("newQuote").addEventListener("click", showRandomQuote);
    createAddQuoteForm(); // Create the form dynamically
    populateCategories(); // Populate categories dropdown
    showRandomQuote(); // Show an initial random quote on page load
});
