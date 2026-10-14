import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';
Object.assign(global, { TextEncoder, TextDecoder });
window.scrollTo = jest.fn() as any;
beforeEach(() => localStorage.clear());