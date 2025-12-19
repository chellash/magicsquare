// ============================================================================
// MAGIC SQUARE GENERATOR - 3 STEP ALGORITHM
// ============================================================================
// This implements the algorithm from the SlideShare presentation:
// "Magic Square Made Easy"
// Reference: https://www.slideshare.net/slideshow/magic-square-32594594/32594594
//
// ALGORITHM OVERVIEW:
// Step 1: Create a number matrix with values 1 to n² in sequence
// Step 2: Create row and column identifier matrices
// Step 3: Superimpose the matrices to create the final magic square
// ============================================================================

// Global variables to store the matrices
let numberMatrix = [];    // Step 1: Sequential numbers 1 to n²
let rowMatrix = [];        // Step 2a: Row identifiers
let columnMatrix = [];     // Step 2b: Column identifiers
let finalMatrix = [];      // Step 3: The final magic square
let order = 0;             // Size of the magic square (n×n)

// ============================================================================
// STEP 1: CREATE NUMBER MATRIX
// ============================================================================
/**
 * Creates a matrix with numbers 1 to n² arranged sequentially.
 * 
 * For n=5, creates:
 *   1   2   3   4   5
 *   6   7   8   9  10
 *  11  12  13  14  15
 *  16  17  18  19  20
 *  21  22  23  24  25
 * 
 * This matrix serves as a lookup table. We'll use the row and column
 * identifier matrices to determine which number goes where in the final square.
 * 
 * @param {number} n - The order of the magic square
 * @returns {Array} - 2D array containing sequential numbers
 */
function createNumberMatrix(n) {
    const matrix = [];
    let num = 1;  // Start with 1

    // Create n rows
    for (let i = 0; i < n; i++) {
        const row = [];

        // Create n columns
        for (let j = 0; j < n; j++) {
            row.push(num);
            num++;  // Increment for next cell
        }

        matrix.push(row);
    }

    return matrix;
}

// ============================================================================
// STEP 2a: CREATE ROW IDENTIFIER MATRIX
// ============================================================================
/**
 * Creates the row identifier matrix.
 * 
 * The pattern:
 * - The middle column is numbered 1 to n (top to bottom)
 * - Columns to the left/right get values by subtracting/adding 1
 * - Values wrap around using modulo arithmetic to stay in range [1, n]
 * 
 * For n=5 (middle column is index 2):
 *   4  5  1  2  3
 *   5  1  2  3  4
 *   1  2  3  4  5  ← Middle row clearly shows the pattern
 *   2  3  4  5  1
 *   3  4  5  1  2
 * 
 * LOGIC:
 * - For each position (i,j), calculate offset from middle column
 * - Start with row number (i+1, since we use 1-indexing)
 * - Add the offset to shift the value
 * - Wrap around to keep values in range [1, n]
 * 
 * @param {number} n - The order of the magic square
 * @returns {Array} - 2D array containing row identifiers
 */
function createRowMatrix(n) {
    const matrix = [];
    const mid = Math.floor(n / 2);  // Middle column index (0-based)

    for (let i = 0; i < n; i++) {
        const row = [];

        for (let j = 0; j < n; j++) {
            // Calculate how far this column is from the middle
            // If j=mid, offset=0; if j<mid, offset is negative; if j>mid, offset is positive
            const offset = j - mid;

            // Start with current row number (1-indexed: i+1)
            // Add offset to shift left/right
            let value = (i + offset + 1);

            // Wrap around to keep in range [1, n]
            // If value is too small, add n until it's in range
            while (value <= 0) {
                value += n;
            }
            // If value is too large, subtract n until it's in range
            while (value > n) {
                value -= n;
            }

            row.push(value);
        }

        matrix.push(row);
    }

    return matrix;
}

// ============================================================================
// STEP 2b: CREATE COLUMN IDENTIFIER MATRIX
// ============================================================================
/**
 * Creates the column identifier matrix as a mirror image of the row matrix.
 * 
 * This means we flip the row matrix horizontally (reverse each row).
 * 
 * For n=5:
 *   3  2  1  5  4  ← Row matrix row 1 (4 5 1 2 3) reversed
 *   4  3  2  1  5  ← Row matrix row 2 (5 1 2 3 4) reversed
 *   5  4  3  2  1  ← Row matrix row 3 (1 2 3 4 5) reversed
 *   1  5  4  3  2  ← Row matrix row 4 (2 3 4 5 1) reversed
 *   2  1  5  4  3  ← Row matrix row 5 (3 4 5 1 2) reversed
 * 
 * WHY MIRROR?
 * The mirroring creates the mathematical relationship needed for the
 * magic square properties to work. When we superimpose the row and column
 * matrices, the mirroring ensures that the sums work out correctly.
 * 
 * @param {number} n - The order of the magic square
 * @returns {Array} - 2D array containing column identifiers
 */
function createColumnMatrix(n) {
    const matrix = [];
    const mid = Math.floor(n / 2);

    for (let i = 0; i < n; i++) {
        const row = [];

        for (let j = 0; j < n; j++) {
            // Mirror the column index: rightmost becomes leftmost
            // If j=0, mirrorJ=n-1; if j=n-1, mirrorJ=0
            const mirrorJ = n - 1 - j;

            // Calculate offset using the MIRRORED column position
            const offset = mirrorJ - mid;

            // Same calculation as row matrix, but using mirrored position
            let value = (i + offset + 1);

            // Wrap around to stay in range [1, n]
            while (value <= 0) {
                value += n;
            }
            while (value > n) {
                value -= n;
            }

            row.push(value);
        }

        matrix.push(row);
    }

    return matrix;
}

// ============================================================================
// STEP 3: CREATE FINAL MAGIC SQUARE
// ============================================================================
/**
 * Creates the final magic square by superimposing the identifier matrices.
 * 
 * ALGORITHM:
 * For each position (i,j) in the final matrix:
 * 1. Look at rowMatrix[i][j] to get the row identifier (call it R)
 * 2. Look at columnMatrix[i][j] to get the column identifier (call it C)
 * 3. Look up numberMatrix[R-1][C-1] to get the value
 *    (subtract 1 because identifiers are 1-indexed but arrays are 0-indexed)
 * 
 * EXAMPLE for n=5, position (0,0):
 * - rowMatrix[0][0] = 4, columnMatrix[0][0] = 3
 * - So we look up numberMatrix[4-1][3-1] = numberMatrix[3][2] = 18
 * 
 * EXAMPLE for n=5, position (0,1):
 * - rowMatrix[0][1] = 5, columnMatrix[0][1] = 2
 * - So we look up numberMatrix[5-1][2-1] = numberMatrix[4][1] = 22
 * 
 * This superimposition creates the magic square where all rows, columns,
 * and diagonals sum to the same value (the magic constant).
 * 
 * @param {number} n - The order of the magic square
 * @returns {Array} - 2D array containing the final magic square
 */
function createFinalMatrix(n) {
    const matrix = [];

    for (let i = 0; i < n; i++) {
        const row = [];

        for (let j = 0; j < n; j++) {
            // Get the row and column identifiers from the respective matrices
            const rowId = rowMatrix[i][j];
            const colId = columnMatrix[i][j];

            // Convert from 1-indexed to 0-indexed
            // (Identifiers are 1 to n, but array indices are 0 to n-1)
            const rowIdx = rowId - 1;
            const colIdx = colId - 1;

            // Look up the value from the number matrix using the identifiers
            const value = numberMatrix[rowIdx][colIdx];

            row.push(value);
        }

        matrix.push(row);
    }

    return matrix;
}

// ============================================================================
// MAGIC CONSTANT CALCULATION
// ============================================================================
/**
 * Calculates the magic constant for a magic square of order n.
 * 
 * The magic constant is the sum that all rows, columns, and diagonals
 * should equal. The formula is:
 * 
 *     M(n) = n × (n² + 1) / 2
 * 
 * DERIVATION:
 * - Sum of all numbers from 1 to n² is: n² × (n² + 1) / 2
 * - This sum is distributed equally among n rows
 * - Each row gets: [n² × (n² + 1) / 2] / n = n × (n² + 1) / 2
 * 
 * EXAMPLES:
 * - n=3: M(3) = 3 × (9 + 1) / 2 = 3 × 10 / 2 = 15
 * - n=5: M(5) = 5 × (25 + 1) / 2 = 5 × 26 / 2 = 65
 * - n=7: M(7) = 7 × (49 + 1) / 2 = 7 × 50 / 2 = 175
 * 
 * @param {number} n - The order of the magic square
 * @returns {number} - The magic constant
 */
function getMagicConstant(n) {
    return (n * (n * n + 1)) / 2;
}

// ============================================================================
// VALIDATION FUNCTION
// ============================================================================
/**
 * Validates that the final matrix is indeed a magic square.
 * 
 * CHECKS PERFORMED:
 * 1. Sum of each row equals magic constant
 * 2. Sum of each column equals magic constant
 * 3. Sum of main diagonal (top-left to bottom-right) equals magic constant
 * 4. Sum of anti-diagonal (top-right to bottom-left) equals magic constant
 * 
 * @returns {Object} - Validation results with detailed information
 */
function validateMagicSquare() {
    const magicConstant = getMagicConstant(order);
    const results = {
        isValid: true,
        magicConstant: magicConstant,
        rows: [],
        columns: [],
        diagonals: {}
    };

    // Check all rows
    for (let i = 0; i < order; i++) {
        let sum = 0;
        for (let j = 0; j < order; j++) {
            sum += finalMatrix[i][j];
        }
        results.rows.push({
            index: i + 1,
            sum: sum,
            valid: sum === magicConstant
        });
        if (sum !== magicConstant) {
            results.isValid = false;
        }
    }

    // Check all columns
    for (let j = 0; j < order; j++) {
        let sum = 0;
        for (let i = 0; i < order; i++) {
            sum += finalMatrix[i][j];
        }
        results.columns.push({
            index: j + 1,
            sum: sum,
            valid: sum === magicConstant
        });
        if (sum !== magicConstant) {
            results.isValid = false;
        }
    }

    // Check main diagonal (top-left to bottom-right)
    let mainDiagSum = 0;
    for (let i = 0; i < order; i++) {
        mainDiagSum += finalMatrix[i][i];
    }
    results.diagonals.main = {
        sum: mainDiagSum,
        valid: mainDiagSum === magicConstant
    };
    if (mainDiagSum !== magicConstant) {
        results.isValid = false;
    }

    // Check anti-diagonal (top-right to bottom-left)
    let antiDiagSum = 0;
    for (let i = 0; i < order; i++) {
        antiDiagSum += finalMatrix[i][order - 1 - i];
    }
    results.diagonals.anti = {
        sum: antiDiagSum,
        valid: antiDiagSum === magicConstant
    };
    if (antiDiagSum !== magicConstant) {
        results.isValid = false;
    }

    return results;
}

// ============================================================================
// UI DISPLAY FUNCTIONS
// ============================================================================

/**
 * Displays a matrix in the specified HTML element.
 * 
 * @param {Array} matrix - The 2D array to display
 * @param {string} elementId - The ID of the HTML element to display in
 */
function displayMatrix(matrix, elementId) {
    const container = document.getElementById(elementId);
    container.innerHTML = '';  // Clear previous content

    const n = matrix.length;

    // Set the grid layout: n columns
    container.style.gridTemplateColumns = `repeat(${n}, 1fr)`;

    // Create a cell for each value in the matrix
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.textContent = matrix[i][j];

            // Add a slight delay to each cell for a staggered animation effect
            cell.style.animation = `fadeIn 0.3s ease-in ${(i * n + j) * 0.02}s both`;

            container.appendChild(cell);
        }
    }
}

/**
 * Displays validation results in the validation section.
 * 
 * @param {Object} validation - The validation results object
 */
function displayValidation(validation) {
    const container = document.getElementById('validationContent');
    container.innerHTML = '';

    // Display rows
    validation.rows.forEach(row => {
        const item = createValidationItem(
            `Row ${row.index}`,
            row.sum,
            row.valid,
            validation.magicConstant
        );
        container.appendChild(item);
    });

    // Display columns
    validation.columns.forEach(col => {
        const item = createValidationItem(
            `Column ${col.index}`,
            col.sum,
            col.valid,
            validation.magicConstant
        );
        container.appendChild(item);
    });

    // Display main diagonal
    const mainDiagItem = createValidationItem(
        'Main Diagonal',
        validation.diagonals.main.sum,
        validation.diagonals.main.valid,
        validation.magicConstant
    );
    container.appendChild(mainDiagItem);

    // Display anti-diagonal
    const antiDiagItem = createValidationItem(
        'Anti-Diagonal',
        validation.diagonals.anti.sum,
        validation.diagonals.anti.valid,
        validation.magicConstant
    );
    container.appendChild(antiDiagItem);
}

/**
 * Creates a validation item element.
 * 
 * @param {string} label - The label (e.g., "Row 1")
 * @param {number} sum - The calculated sum
 * @param {boolean} isValid - Whether the sum equals the magic constant
 * @param {number} expected - The expected magic constant
 * @returns {HTMLElement} - The validation item element
 */
function createValidationItem(label, sum, isValid, expected) {
    const item = document.createElement('div');
    item.className = `validation-item ${isValid ? 'valid' : 'invalid'}`;

    const labelSpan = document.createElement('span');
    labelSpan.textContent = label + ':';

    const valueSpan = document.createElement('span');
    valueSpan.className = `status ${isValid ? 'valid' : 'invalid'}`;
    valueSpan.textContent = `${sum} ${isValid ? '✓' : '✗ (expected ' + expected + ')'}`;

    item.appendChild(labelSpan);
    item.appendChild(valueSpan);

    return item;
}

/**
 * Switches between different step views (tabs).
 * 
 * @param {string} step - Which step to show ('numbers', 'row', 'column', 'final')
 */
function showStep(step) {
    // Hide all sections
    document.querySelectorAll('.output-section').forEach(section => {
        section.classList.remove('active');
    });

    // Remove active class from all tabs
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });

    // Show the selected section and activate its tab
    const sections = {
        'numbers': 'numbersSection',
        'row': 'rowSection',
        'column': 'columnSection',
        'final': 'finalSection'
    };

    document.getElementById(sections[step]).classList.add('active');

    // Activate the corresponding tab
    const tabs = document.querySelectorAll('.tab');
    const tabIndex = {
        'final': 0,
        'numbers': 1,
        'row': 2,
        'column': 3
    };
    tabs[tabIndex[step]].classList.add('active');

    // Show validation only for final step
    const validationSection = document.getElementById('validationSection');
    validationSection.style.display = step === 'final' ? 'block' : 'none';
}

// ============================================================================
// MAIN GENERATION FUNCTION
// ============================================================================
/**
 * Main function that generates the magic square when the button is clicked.
 * 
 * WORKFLOW:
 * 1. Get the order from input and validate it
 * 2. Create all three matrices (number, row, column)
 * 3. Superimpose them to create the final magic square
 * 4. Display all matrices in their respective sections
 * 5. Validate the final square and display results
 */
function generateMagicSquare() {
    // Get the order from input field
    const input = document.getElementById('orderInput');
    order = parseInt(input.value);

    // Validate input
    if (isNaN(order) || order < 3 || order > 15) {
        alert('Please enter a valid number between 3 and 15');
        return;
    }

    if (order % 2 === 0) {
        alert('Order must be ODD! Please enter 3, 5, 7, 9, 11, 13, or 15');
        return;
    }

    // Execute the 3-step algorithm
    numberMatrix = createNumberMatrix(order);        // Step 1
    rowMatrix = createRowMatrix(order);              // Step 2a
    columnMatrix = createColumnMatrix(order);        // Step 2b
    finalMatrix = createFinalMatrix(order);          // Step 3

    // Display all matrices
    displayMatrix(numberMatrix, 'numbersMatrix');
    displayMatrix(rowMatrix, 'rowMatrix');
    displayMatrix(columnMatrix, 'columnMatrix');
    displayMatrix(finalMatrix, 'finalMatrix');

    // Update magic constant display
    const magicConstant = getMagicConstant(order);
    document.getElementById('magicConstant').textContent = magicConstant;

    // Validate and display results
    const validation = validateMagicSquare();
    displayValidation(validation);

    // Show the tabs and validation section
    document.getElementById('tabsContainer').style.display = 'block';
    document.getElementById('validationSection').style.display = 'block';

    // Show the final matrix by default
    showStep('final');
}

// ============================================================================
// CSS ANIMATION FOR CELLS
// ============================================================================
// Add keyframe animation dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: scale(0.8);
        }
        to {
            opacity: 1;
            transform: scale(1);
        }
    }
`;
document.head.appendChild(style);
