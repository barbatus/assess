import "@testing-library/jest-dom";
import { render, screen, fireEvent, act  } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing";
import mockRouter from 'next-router-mock';

import { AuthProvider } from "~/hooks/auth";
import { User } from "~/prisma/generated/type-graphql";

import { buildMocks } from '~/__mocks__/gql-mocks';

import { BooksTable  } from '../books';

jest.mock('next/router', () => require('next-router-mock'));

const mockUser: User = {
  id: 1,
  name: 'Bob',
  email: 'bob@alice.com',
}

const renderMockTable = (status: "READ" | 'READING' | 'TO_READ', pageSize: number) => {
  render(
    <AuthProvider initialUser={mockUser}>
      <MockedProvider mocks={buildMocks(status, pageSize)}>
        <BooksTable status={status} pageSize={pageSize} />
      </MockedProvider>
    </AuthProvider>
  );
}

it("render books with READ status in table", async () => {
  renderMockTable('READ', 10);
  expect(await screen.findByText("otis fay")).toBeInTheDocument();
  expect(await screen.findByText("3/19/2023")).toBeInTheDocument();
});

it("pressing Next should render next page", async () => {
  renderMockTable('READ', 2);
  await act(() => {
    fireEvent.click(screen.getByTestId('next'));
  });
  expect(await screen.findByText("wallace d'amore")).toBeInTheDocument();
});

it("pressing Next should not render next page if no more books", async () => {
  renderMockTable('READ', 6);
  await act(() => {
    fireEvent.click(screen.getByTestId('next'));
  });
  expect(await screen.findByText("otis fay")).toBeInTheDocument();
});

it("should show 'no results' if no data", async () => {
  renderMockTable('READING', 6);
  await act(() => {
    fireEvent.click(screen.getByTestId('next'));
  });
  expect(await screen.findByText(new RegExp("no results", "i"))).toBeInTheDocument();
});

it("pressing Add should navigate to add page", async () => {
  renderMockTable('READING', 6);
  await act(() => {
    fireEvent.click(screen.getByTestId('add'));
  });
  expect(mockRouter).toMatchObject({ 
    pathname: "/add",
  });
});
