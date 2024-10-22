//Written by Ijaz for the Currency Calculator user story

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import CurrencyCalculator from './CurrencyCalculator.js';

describe('CurrencyCalculator', () => {
  it('renders correctly', () => {
    render(<CurrencyCalculator />);
    expect(screen.getByText('Currency Calculator')).toBeInTheDocument();
  });

  it('allows user to input an amount and select currencies', () => {
    render(<CurrencyCalculator />);

    //Test entering an amount
    const amountInput = screen.getByPlaceholderText('Enter amount');
    fireEvent.change(amountInput, { target: { value: '100' } });
    expect(amountInput.value).toBe('100');

    //Test changing 'from' currency
    const fromCurrencySelect = screen.getByDisplayValue('NZD');
    fireEvent.change(fromCurrencySelect, { target: { value: 'USD' } });
    expect(fromCurrencySelect.value).toBe('USD');

    //Test changing 'to' currency
    const toCurrencySelect = screen.getByDisplayValue('AUD');
    fireEvent.change(toCurrencySelect, { target: { value: 'EUR' } });
    expect(toCurrencySelect.value).toBe('EUR');
  });

  it('calculates the correct converted amount', () => {
    render(<CurrencyCalculator />);

    //Test entering an amount
    const amountInput = screen.getByPlaceholderText('Enter amount');
    fireEvent.change(amountInput, { target: { value: '100' } });

    //Test currencies
    const fromCurrencySelect = screen.getByDisplayValue('NZD');
    fireEvent.change(fromCurrencySelect, { target: { value: 'NZD' } });

    const toCurrencySelect = screen.getByDisplayValue('AUD');
    fireEvent.change(toCurrencySelect, { target: { value: 'AUD' } });

    //Test convert button
    const convertButton = screen.getByText('Convert');
    fireEvent.click(convertButton);

    //Test correct conversion
    const convertedAmount = screen.getByText('Converted Amount: 91.00 AUD');
    expect(convertedAmount).toBeInTheDocument();
  });
});
