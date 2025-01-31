const quotes = JSON.parse(localStorage.getItem("quotes")) || [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
    { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", category: "Success" },
    { text: "In the middle of every difficulty lies opportunity.", category: "Inspiration" }
];

const API_URL = "https://jsonplaceholder.typicode.com/posts";

async function fetchQuotesFromServer() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        const serverQuotes = data.map(post => ({ text: post.body, category: "Server" }));
        mergeQuotes(serverQuotes);
    } catch (error) {
        console.error("Error fetching quotes from server:", error);
    }
}

async function postQuoteToServer(quote) {
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(quote)
        });
        const data = await response.json();
        console.log("Quote posted successfully:", data);
    } catch (error) {
        console.error("Error posting quote to server:", error);
    }
}

function mergeQuotes(serverQuotes) {
    const localQuotes = JSON.parse(localStorage.getItem("quotes")) || [];
    const mergedQuotes = [...new Map([...localQuotes, ...serverQuotes].map(q => [q.text, q])).values()];
    localStorage.setItem("quotes", JSON.stringify(mergedQuotes));
    quotes.length = 0;
    quotes.push(...mergedQuotes);
    populateCategories();
    showRandomQuote();
}

function syncQuotes() {
    setInterval(fetchQuotesFromServer, 60000);
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
    postQuoteToServer(newQuote);
    showRandomQuote();
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
        mergeQuotes(importedQuotes);
    };
    reader.readAsText(file);
}
