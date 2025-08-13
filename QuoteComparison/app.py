<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Quote Comparison Tool</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Inter', sans-serif;
        }
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #1f2937; }
        ::-webkit-scrollbar-thumb { background: #4b5563; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #6b7280; }
        .comparison-table th, .comparison-table td {
            padding: 0.75rem 1rem;
            border-bottom: 1px solid #374151;
        }
        .comparison-table th { text-align: left; font-weight: 600; color: #d1d5db; }
        .comparison-table tr:last-child td { border-bottom: none; }
        #loader {
            border: 5px solid #f3f3f3; /* Light grey */
            border-top: 5px solid #3498db; /* Blue */
            border-radius: 50%;
            width: 50px;
            height: 50px;
            animation: spin 1s linear infinite;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    </style>
</head>
<body class="bg-gray-900 text-gray-200">

    <div id="app" class="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        
        <header class="mb-8 text-center">
            <h1 class="text-3xl sm:text-4xl font-bold text-white">Commercial Insurance Quote Comparison</h1>
            <p class="mt-2 text-lg text-gray-400">Upload two quotes to begin the analysis.</p>
        </header>

        <!-- Main Content to be Exported as PDF -->
        <div id="pdf-content" class="hidden">
            <!-- Agent Overview & Recommendation -->
            <div class="bg-gray-800 rounded-xl p-6 mb-8 shadow-lg">
                <h2 class="text-2xl font-semibold text-white mb-4">Agent Overview & Recommendation</h2>
                <textarea id="agent-recommendation" class="w-full h-40 bg-gray-700 border border-gray-600 rounded-lg p-4 text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200" placeholder="Enter your summary, analysis, and recommendation here. This field is editable..."></textarea>
            </div>
        </div>

        <!-- Comparison Grid -->
        <div id="comparison-grid" class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <!-- Quote 1 Column -->
            <div id="quote1-column" class="bg-gray-800 rounded-xl shadow-lg p-6 flex flex-col">
                <h3 class="text-2xl font-bold text-center text-blue-400 mb-4">Option A</h3>
                <div class="mb-6">
                    <div class="flex items-center justify-center w-full">
                        <label for="file-upload-1" class="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-700 hover:bg-gray-600 transition">
                            <div class="flex flex-col items-center justify-center pt-5 pb-6">
                                <svg class="w-8 h-8 mb-4 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/></svg>
                                <p class="mb-2 text-sm text-gray-400"><span class="font-semibold">Click to upload Quote 1</span></p>
                            </div>
                            <input id="file-upload-1" type="file" class="hidden" accept=".pdf" />
                        </label>
                    </div> 
                    <p id="file-name-1" class="text-center text-sm text-gray-500 mt-2 truncate">No file selected</p>
                </div>
                <div id="quote1-details" class="hidden space-y-6 flex-grow flex flex-col">
                    <div class="text-center">
                        <p id="quote1-carrier" class="text-lg font-semibold text-white"></p>
                        <p id="quote1-premium" class="text-3xl font-bold text-green-400 mt-1"></p>
                        <p class="text-sm text-gray-400">Annual Premium</p>
                    </div>
                    <div class="bg-gray-700/50 rounded-lg p-4"><h4 class="text-lg font-semibold text-white mb-2">High-Level Summary</h4><p id="quote1-summary" class="text-sm text-gray-300"></p></div>
                    <div class="bg-gray-700/50 rounded-lg p-4 flex-grow"><h4 class="text-lg font-semibold text-white mb-3">Coverages & Limits</h4><table class="w-full text-sm comparison-table"><tbody id="quote1-coverages"></tbody></table></div>
                    <div class="bg-gray-700/50 rounded-lg p-4"><h4 class="text-lg font-semibold text-white mb-2">Key Exclusions</h4><ul id="quote1-exclusions" class="list-disc list-inside text-sm text-gray-300 space-y-1"></ul></div>
                </div>
            </div>

            <!-- Quote 2 Column -->
            <div id="quote2-column" class="bg-gray-800 rounded-xl shadow-lg p-6 flex flex-col">
                <h3 class="text-2xl font-bold text-center text-purple-400 mb-4">Option B</h3>
                 <div class="mb-6">
                    <div class="flex items-center justify-center w-full">
                        <label for="file-upload-2" class="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-700 hover:bg-gray-600 transition">
                            <div class="flex flex-col items-center justify-center pt-5 pb-6">
                                <svg class="w-8 h-8 mb-4 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/></svg>
                                <p class="mb-2 text-sm text-gray-400"><span class="font-semibold">Click to upload Quote 2</span></p>
                            </div>
                            <input id="file-upload-2" type="file" class="hidden" accept=".pdf" />
                        </label>
                    </div>
                    <p id="file-name-2" class="text-center text-sm text-gray-500 mt-2 truncate">No file selected</p>
                </div>
                <div id="quote2-details" class="hidden space-y-6 flex-grow flex flex-col">
                    <div class="text-center">
                        <p id="quote2-carrier" class="text-lg font-semibold text-white"></p>
                        <p id="quote2-premium" class="text-3xl font-bold text-green-400 mt-1"></p>
                        <p class="text-sm text-gray-400">Annual Premium</p>
                    </div>
                    <div class="bg-gray-700/50 rounded-lg p-4"><h4 class="text-lg font-semibold text-white mb-2">High-Level Summary</h4><p id="quote2-summary" class="text-sm text-gray-300"></p></div>
                    <div class="bg-gray-700/50 rounded-lg p-4 flex-grow"><h4 class="text-lg font-semibold text-white mb-3">Coverages & Limits</h4><table class="w-full text-sm comparison-table"><tbody id="quote2-coverages"></tbody></table></div>
                    <div class="bg-gray-700/50 rounded-lg p-4"><h4 class="text-lg font-semibold text-white mb-2">Key Exclusions</h4><ul id="quote2-exclusions" class="list-disc list-inside text-sm text-gray-300 space-y-1"></ul></div>
                </div>
            </div>
        </div>

        <!-- Action Buttons -->
        <footer id="actions" class="mt-8 text-center space-x-4">
             <button id="compare-button" class="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 disabled:bg-gray-500 disabled:cursor-not-allowed" disabled>
                Compare Quotes
            </button>
            <button id="download-pdf" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 hidden">
                Download Proposal as PDF
            </button>
        </footer>

        <!-- Loader and Message Area -->
        <div id="message-area" class="mt-6 text-center"></div>

    </div>

    <script>
        document.addEventListener('DOMContentLoaded', function() {
            const fileUpload1 = document.getElementById('file-upload-1');
            const fileName1 = document.getElementById('file-name-1');
            const fileUpload2 = document.getElementById('file-upload-2');
            const fileName2 = document.getElementById('file-name-2');
            const compareButton = document.getElementById('compare-button');
            const downloadButton = document.getElementById('download-pdf');
            const messageArea = document.getElementById('message-area');
            
            function checkFiles() {
                if (fileUpload1.files.length > 0 && fileUpload2.files.length > 0) {
                    compareButton.disabled = false;
                } else {
                    compareButton.disabled = true;
                }
            }

            fileUpload1.addEventListener('change', (event) => {
                const file = event.target.files[0];
                fileName1.textContent = file ? file.name : 'No file selected';
                checkFiles();
            });

            fileUpload2.addEventListener('change', (event) => {
                const file = event.target.files[0];
                fileName2.textContent = file ? file.name : 'No file selected';
                checkFiles();
            });

            compareButton.addEventListener('click', async () => {
                messageArea.innerHTML = `<div id="loader" class="mx-auto"></div><p class="mt-2">Processing PDFs... This may take a moment.</p>`;
                compareButton.disabled = true;

                const formData = new FormData();
                formData.append('quote1', fileUpload1.files[0]);
                formData.append('quote2', fileUpload2.files[0]);

                try {
                    const response = await fetch('/compare', {
                        method: 'POST',
                        body: formData,
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.error || 'Server error');
                    }

                    const data = await response.json();
                    populateUI(data);
                    messageArea.innerHTML = '';
                    
                } catch (error) {
                    messageArea.innerHTML = `<p class="text-red-400">Error: ${error.message}</p>`;
                    compareButton.disabled = false; // Re-enable on error
                }
            });

            function populateUI(data) {
                // Populate Quote 1
                const q1 = data.quote1;
                document.getElementById('quote1-carrier').textContent = q1.carrier_name;
                document.getElementById('quote1-premium').textContent = `$${q1.annual_premium}`;
                document.getElementById('quote1-summary').textContent = q1.summary;
                
                const q1Coverages = document.getElementById('quote1-coverages');
                q1Coverages.innerHTML = q1.coverages.map(c => `<tr><td class="font-semibold">${c.name}</td><td class="text-right">${c.limit}</td></tr>`).join('');
                
                const q1Exclusions = document.getElementById('quote1-exclusions');
                q1Exclusions.innerHTML = q1.exclusions.map(e => `<li>${e}</li>`).join('');

                // Populate Quote 2
                const q2 = data.quote2;
                document.getElementById('quote2-carrier').textContent = q2.carrier_name;
                document.getElementById('quote2-premium').textContent = `$${q2.annual_premium}`;
                document.getElementById('quote2-summary').textContent = q2.summary;

                const q2Coverages = document.getElementById('quote2-coverages');
                q2Coverages.innerHTML = q2.coverages.map(c => `<tr><td class="font-semibold">${c.name}</td><td class="text-right">${c.limit}</td></tr>`).join('');

                const q2Exclusions = document.getElementById('quote2-exclusions');
                q2Exclusions.innerHTML = q2.exclusions.map(e => `<li>${e}</li>`).join('');
                
                // Show details and hide upload boxes
                document.getElementById('quote1-details').classList.remove('hidden');
                document.getElementById('quote2-details').classList.remove('hidden');
                document.getElementById('pdf-content').classList.remove('hidden');
                document.getElementById('file-upload-1').parentElement.parentElement.classList.add('hidden');
                document.getElementById('file-upload-2').parentElement.parentElement.classList.add('hidden');
                compareButton.classList.add('hidden');
                downloadButton.classList.remove('hidden');
            }

            downloadButton.addEventListener('click', () => {
                const element = document.getElementById('pdf-content');
                // We need to also include the visible comparison grid in the PDF
                const fullContent = document.createElement('div');
                fullContent.appendChild(element.cloneNode(true));
                fullContent.appendChild(document.getElementById('comparison-grid').cloneNode(true));
                
                const agentRecommendationText = document.getElementById('agent-recommendation').value;
                const printDiv = document.createElement('div');
                printDiv.className = "w-full h-40 bg-gray-700 border border-gray-600 rounded-lg p-4 text-gray-200";
                printDiv.style.whiteSpace = 'pre-wrap';
                printDiv.style.wordBreak = 'break-word';
                printDiv.style.height = 'auto';
                printDiv.textContent = agentRecommendationText;
                
                // In the cloned content for the PDF, replace the textarea with the static div
                const clonedTextarea = fullContent.querySelector('#agent-recommendation');
                clonedTextarea.style.display = 'none';
                clonedTextarea.parentNode.insertBefore(printDiv, clonedTextarea);

                const opt = {
                    margin: 0.5,
                    filename: 'QuoteComparison_Proposal.pdf',
                    image: { type: 'jpeg', quality: 0.98 },
                    html2canvas: { scale: 2, useCORS: true, backgroundColor: '#111827' },
                    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
                };

                html2pdf().from(fullContent).set(opt).save();
            });
        });
    </script>
</body>
</html>
