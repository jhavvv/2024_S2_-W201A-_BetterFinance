import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import WelcomePage from './WelcomePage';
import { getDoc } from 'firebase/firestore';
import { TextEncoder, TextDecoder } from 'util';

// Polyfill for TextEncoder and TextDecoder
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
global.ReadableStream = require('stream').Readable;

// Mock Firebase Auth
jest.mock('firebase/auth', () => ({
    getAuth: jest.fn(),
}));

// Mock Firebase Firestore functions
jest.mock('firebase/firestore', () => ({
    doc: jest.fn(),
    getDoc: jest.fn(),
}));

// Mock current time (assuming now is Oct 21, 2024, at 3:00 PM)
jest.useFakeTimers('modern').setSystemTime(new Date('2024-10-21T15:00:00'));

describe('WelcomePage component', () => {
    it('should show the pop-up if more than 24 hours have passed since the last transaction', async () => {
        // Mock Firestore returning a lastInputTimestamp of Oct 20, 2024, at 12:00 PM
        getDoc.mockResolvedValue({
            exists: () => true,
            data: () => ({
                lastInputTimestamp: {
                    toDate: () => new Date('2024-10-20T12:00:00'),
                },
            }),
        });

        render(<WelcomePage />);

        // Wait for the modal to appear
        await waitFor(() => {
            expect(screen.getByText('It’s been more than 24 hours since your last update. Please update or add information.')).toBeInTheDocument();
        });
    });

    it('should not show the pop-up if less than 24 hours have passed since the last transaction', async () => {
        // Mock Firestore returning a lastInputTimestamp of Oct 21, 2024, at 1:00 PM
        getDoc.mockResolvedValue({
            exists: () => true,
            data: () => ({
                lastInputTimestamp: {
                    toDate: () => new Date('2024-10-21T13:00:00'),
                },
            }),
        });

        render(<WelcomePage />);

        // Ensure no modal appears
        await waitFor(() => {
            expect(screen.queryByText('It’s been more than 24 hours since your last update. Please update or add information.')).not.toBeInTheDocument();
        });
    });

    it('should handle errors when fetching data from Firestore', async () => {
        getDoc.mockRejectedValue(new Error('Firestore error'));

        render(<WelcomePage />);

        await waitFor(() => {
            expect(screen.getByText('Error checking time difference')).toBeInTheDocument(); // Adjust the error message as per your UI
        });
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    test('dummy test', () => {
        console.log('This test runs');
        expect(true).toBe(true);
    });

});
