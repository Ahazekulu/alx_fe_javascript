
const quotes = JSON.parse(localStorage.getItem("quotes")) || [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
    { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", category: "Success" },
    { text: "In the middle of every difficulty lies opportunity.", category: "Inspiration" }
];

const API_URL = "https://jsonplaceholder.typicode.com/posts";

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
        <button id="exportQuotes">Export Quotes</button>
        <input type="file" id="importQuotes" accept="application/json">
    `;
    document.body.appendChild(formContainer);
    
    document.getElementById("addQuoteButton").addEventListener("click", addQuote);
    document.getElementById("exportQuotes").addEventListener("click", exportToJsonFile);
    document.getElementById("importQuotes").addEventListener("change", importFromJsonFile);
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


    document.getElementById("quoteDisplay").innerHTML = `<p>"${newQuote.text}"</p>
                                                          <p><strong>Category:</strong> ${newQuote.category}</p>`;
}


function exportToJsonFile() {
    const dataStr = JSON.stringify(quotes, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "quotes.json";
    a.click();
    URL.revokeObjectURL(url);
}


function importFromJsonFile(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const importedQuotes = JSON.parse(e.target.result);
        quotes.push(...importedQuotes);
        localStorage.setItem("quotes", JSON.stringify(quotes));
        populateCategories();
        showRandomQuote();
    };
    reader.readAsText(file);
}


async function fetchQuotesFromServer() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        quotes.push(...data.map(post => ({ text: post.body, category: "Server" })));
        localStorage.setItem("quotes", JSON.stringify(quotes));
        populateCategories();
    } catch (error) {
        console.error("Error fetching quotes from server:", error);
    }
}


function syncQuotes() {
    setInterval(fetchQuotesFromServer, 60000);
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
    createAddQuoteForm(); 
    populateCategories(); 
    showRandomQuote(); 
    syncQuotes(); 
});
