import "@testing-library/jest-dom";
import { render, screen, fireEvent, act  } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing";
import mockRouter from 'next-router-mock';
import { enableFetchMocks } from 'jest-fetch-mock'
enableFetchMocks();

import { AuthProvider } from "~/hooks/auth";
import { User } from "~/prisma/generated/type-graphql";

import { buildMocks } from '~/__mocks__/gql-mocks';

import Home from '../[tab].page';

jest.mock('next/router', () => require('next-router-mock'));

const mockUser: User = {
  id: 1,
  name: 'Bob',
  email: 'bob@alice.com',
}

const renderMockPage = (statuses: ("READ" | 'READING' | 'TO_READ')[], pageSize: number, authors: string[]) => {
  const allMocks = statuses.map((status, ind) => buildMocks(status, pageSize, [authors[ind]])!).flat();
  return render(
    <AuthProvider initialUser={mockUser}>
      <MockedProvider mocks={allMocks}>
        <Home />
      </MockedProvider>
    </AuthProvider>
  );
}

it("render books with READ by default and navigate to READING on tab click", async () => {
  const mock = renderMockPage(['READ', 'READING'], 10, ['otis fay', "wallace d'amore"]);
  expect(await screen.findByText("otis fay")).toBeInTheDocument();
  expect(await screen.queryByText("wallace d'amore")).not.toBeInTheDocument();

  await act(() => {
    fireEvent.click(screen.getByTestId('reading'));
  });
  expect(mockRouter).toMatchObject({ 
    pathname: "./reading",
  });
});

it("render load books with READING status when it's in the route param", async () => {
  mockRouter.push("/home?tab=reading");
  const mock = renderMockPage(['READ', 'READING'], 10, ['otis fay', "wallace d'amore"]);
  expect(await screen.findByText("wallace d'amore")).toBeInTheDocument();
  expect(await mock.container.querySelectorAll('tr').length).toEqual(2);
});
