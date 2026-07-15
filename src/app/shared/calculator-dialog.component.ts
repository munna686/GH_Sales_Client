import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-calculator-dialog',
    standalone: true,
    imports: [CommonModule, DialogModule, ButtonModule],
    template: `
        <p-dialog 
            [(visible)]="visible" 
            [modal]="true" 
            [style]="{width: '380px'}"
            [draggable]="true"
            [resizable]="false"
            [focusOnShow]="true"
            header="Scientific Calculator">
            <div class="calculator">
                <div class="display">
                    <div class="memory-indicator" *ngIf="memory !== 0">
                        <span class="text-xs text-white px-2 py-1 rounded" style="background: var(--primary-color)">M: {{ memory }}</span>
                    </div>
                    <div class="expression">{{ expression || '0' }}</div>
                    <div class="result">{{ display }}</div>
                </div>
                <div class="buttons">
                    <!-- Memory & Function Row -->
                    <button (click)="memoryClear()" class="btn btn-memory" title="Memory Clear">MC</button>
                    <button (click)="memoryRecall()" class="btn btn-memory" title="Memory Recall">MR</button>
                    <button (click)="memoryAdd()" class="btn btn-memory" title="Memory Add">M+</button>
                    <button (click)="memorySubtract()" class="btn btn-memory" title="Memory Subtract">M-</button>
                    
                    <!-- Scientific Functions Row -->
                    <button (click)="percentage()" class="btn btn-function">%</button>
                    <button (click)="squareRoot()" class="btn btn-function">√</button>
                    <button (click)="square()" class="btn btn-function">x²</button>
                    <button (click)="reciprocal()" class="btn btn-function">1/x</button>
                    
                    <!-- Main Calculator -->
                    <button (click)="clear()" class="btn btn-function span-2">AC</button>
                    <button (click)="backspace()" class="btn btn-function">⌫</button>
                    <button (click)="appendOperator('/')" class="btn btn-operator">÷</button>
                    
                    <button (click)="appendNumber('7')" class="btn">7</button>
                    <button (click)="appendNumber('8')" class="btn">8</button>
                    <button (click)="appendNumber('9')" class="btn">9</button>
                    <button (click)="appendOperator('*')" class="btn btn-operator">×</button>
                    
                    <button (click)="appendNumber('4')" class="btn">4</button>
                    <button (click)="appendNumber('5')" class="btn">5</button>
                    <button (click)="appendNumber('6')" class="btn">6</button>
                    <button (click)="appendOperator('-')" class="btn btn-operator">−</button>
                    
                    <button (click)="appendNumber('1')" class="btn">1</button>
                    <button (click)="appendNumber('2')" class="btn">2</button>
                    <button (click)="appendNumber('3')" class="btn">3</button>
                    <button (click)="appendOperator('+')" class="btn btn-operator">+</button>
                    
                    <button (click)="toggleSign()" class="btn">±</button>
                    <button (click)="appendNumber('0')" class="btn">0</button>
                    <button (click)="appendNumber('.')" class="btn">.</button>
                    <button (click)="calculate()" class="btn btn-equals">=</button>
                </div>
            </div>
        </p-dialog>
    `,
    styles: [`
        .calculator {
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
            padding: 1rem;
            border-radius: 8px;
        }

        .display {
            background: white;
            border-radius: 8px;
            padding: 1rem;
            margin-bottom: 1rem;
            box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
            text-align: right;
            min-height: 100px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            border: 2px solid var(--primary-color);
        }

        .memory-indicator {
            text-align: left;
            margin-bottom: 0.5rem;
        }

        .expression {
            font-size: 0.875rem;
            color: #6c757d;
            min-height: 20px;
        }

        .result {
            font-size: 2rem;
            font-weight: 600;
            color: #212529;
            word-wrap: break-word;
        }

        .buttons {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 0.5rem;
        }

        .btn {
            padding: 1rem;
            border: none;
            border-radius: 8px;
            font-size: 1.1rem;
            font-weight: 500;
            cursor: pointer;
            background: white;
            color: #212529;
            transition: all 0.2s;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 6px rgba(0,0,0,0.15);
        }

        .btn:active {
            transform: translateY(0);
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .btn-memory {
            background: var(--primary-color);
            color: white;
            font-size: 0.9rem;
        }

        .btn-memory:hover {
            background: var(--primary-600);
        }

        .btn-function {
            background: #64748b;
            color: white;
        }

        .btn-function:hover {
            background: #475569;
        }

        .btn-operator {
            background: var(--primary-color);
            color: white;
            font-size: 1.3rem;
        }

        .btn-operator:hover {
            background: var(--primary-600);
        }

        .btn-equals {
            background: #10b981;
            color: white;
            font-size: 1.3rem;
        }

        .btn-equals:hover {
            background: #059669;
        }

        .span-2 {
            grid-column: span 2;
        }
    `]
})
export class CalculatorDialogComponent {
    visible = false;
    display = '0';
    expression = '';
    currentNumber = '';
    operator = '';
    previousNumber = '';
    memory = 0;

    @HostListener('window:keydown', ['$event'])
    handleKeyboardEvent(event: KeyboardEvent) {
        if (!this.visible) return;

        const key = event.key;

        // Numbers
        if (/^[0-9.]$/.test(key)) {
            event.preventDefault();
            this.appendNumber(key);
        }
        // Operators
        else if (key === '+' || key === '-' || key === '*' || key === '/') {
            event.preventDefault();
            this.appendOperator(key);
        }
        // Enter or =
        else if (key === 'Enter' || key === '=') {
            event.preventDefault();
            this.calculate();
        }
        // Escape or C
        else if (key === 'Escape' || key.toLowerCase() === 'c') {
            event.preventDefault();
            this.clear();
        }
        // Backspace
        else if (key === 'Backspace') {
            event.preventDefault();
            this.backspace();
        }
        // Percentage
        else if (key === '%') {
            event.preventDefault();
            this.percentage();
        }
    }

    open() {
        this.visible = true;
    }

    close() {
        this.visible = false;
    }

    appendNumber(num: string) {
        if (num === '.' && this.currentNumber.includes('.')) return;
        
        if (this.currentNumber === '0' && num !== '.') {
            this.currentNumber = num;
        } else {
            this.currentNumber += num;
        }
        
        this.display = this.currentNumber;
        this.updateExpression();
    }

    appendOperator(op: string) {
        if (this.currentNumber === '' && this.previousNumber === '') return;
        
        if (this.previousNumber !== '' && this.currentNumber !== '') {
            this.calculate();
        }
        
        this.operator = op;
        this.previousNumber = this.currentNumber || this.previousNumber;
        this.currentNumber = '';
        this.updateExpression();
    }

    calculate() {
        if (this.previousNumber === '' || this.currentNumber === '' || this.operator === '') return;
        
        const num1 = parseFloat(this.previousNumber);
        const num2 = parseFloat(this.currentNumber);
        let result = 0;
        
        switch (this.operator) {
            case '+':
                result = num1 + num2;
                break;
            case '-':
                result = num1 - num2;
                break;
            case '*':
                result = num1 * num2;
                break;
            case '/':
                result = num2 !== 0 ? num1 / num2 : 0;
                break;
        }
        
        this.display = this.formatNumber(result);
        this.expression = `${this.previousNumber} ${this.getOperatorSymbol(this.operator)} ${this.currentNumber} =`;
        this.currentNumber = result.toString();
        this.previousNumber = '';
        this.operator = '';
    }

    clear() {
        this.display = '0';
        this.expression = '';
        this.currentNumber = '';
        this.operator = '';
        this.previousNumber = '';
    }

    backspace() {
        if (this.currentNumber.length > 0) {
            this.currentNumber = this.currentNumber.slice(0, -1);
            this.display = this.currentNumber || '0';
            this.updateExpression();
        }
    }

    // New Scientific Functions
    percentage() {
        if (this.currentNumber) {
            const value = parseFloat(this.currentNumber) / 100;
            this.currentNumber = value.toString();
            this.display = this.formatNumber(value);
            this.expression = `${this.currentNumber}%`;
        }
    }

    squareRoot() {
        if (this.currentNumber) {
            const value = parseFloat(this.currentNumber);
            if (value < 0) {
                this.display = 'Error';
                return;
            }
            const result = Math.sqrt(value);
            this.currentNumber = result.toString();
            this.display = this.formatNumber(result);
            this.expression = `√(${value})`;
        }
    }

    square() {
        if (this.currentNumber) {
            const value = parseFloat(this.currentNumber);
            const result = value * value;
            this.currentNumber = result.toString();
            this.display = this.formatNumber(result);
            this.expression = `(${value})²`;
        }
    }

    reciprocal() {
        if (this.currentNumber) {
            const value = parseFloat(this.currentNumber);
            if (value === 0) {
                this.display = 'Error';
                return;
            }
            const result = 1 / value;
            this.currentNumber = result.toString();
            this.display = this.formatNumber(result);
            this.expression = `1/(${value})`;
        }
    }

    toggleSign() {
        if (this.currentNumber && this.currentNumber !== '0') {
            if (this.currentNumber.startsWith('-')) {
                this.currentNumber = this.currentNumber.substring(1);
            } else {
                this.currentNumber = '-' + this.currentNumber;
            }
            this.display = this.currentNumber;
            this.updateExpression();
        }
    }

    // Memory Functions
    memoryClear() {
        this.memory = 0;
    }

    memoryRecall() {
        this.currentNumber = this.memory.toString();
        this.display = this.formatNumber(this.memory);
        this.updateExpression();
    }

    memoryAdd() {
        if (this.currentNumber) {
            this.memory += parseFloat(this.currentNumber);
        }
    }

    memorySubtract() {
        if (this.currentNumber) {
            this.memory -= parseFloat(this.currentNumber);
        }
    }

    private updateExpression() {
        if (this.previousNumber && this.operator) {
            this.expression = `${this.previousNumber} ${this.getOperatorSymbol(this.operator)} ${this.currentNumber}`;
        } else {
            this.expression = this.currentNumber;
        }
    }

    private getOperatorSymbol(op: string): string {
        const symbols: { [key: string]: string } = {
            '+': '+',
            '-': '−',
            '*': '×',
            '/': '÷'
        };
        return symbols[op] || op;
    }

    private formatNumber(num: number): string {
        // Format number to max 10 decimal places
        const formatted = parseFloat(num.toFixed(10));
        return formatted.toString();
    }
}
