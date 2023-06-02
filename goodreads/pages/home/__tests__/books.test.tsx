import "@testing-library/jest-dom";
import { render, screen, fireEvent, act  } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing";
import mockRouter from 'next-router-mock';

import { AuthProvider } from "~/goodreads/hooks/auth";
import { User } from "~/goodreads/prisma/generated/type-graphql";

import { buildMocks } from '~/goodreads/__mocks__/gql-mocks';

import { BooksTable  } from '../books';

jest.mock('next/router', () => require('next-router-mock'));

const mockUser: User = {
  id: 1,
  name: 'Bob',
  email: 'bob@alice.com',
}

const renderMockTable = (status: "READ" | 'READING' | 'TO_READ', pageSize: number, authors?: string[]) => {
  return render(
    <AuthProvider initialUser={mockUser}>
      <MockedProvider mocks={buildMocks(status, pageSize, authors)}>
        <BooksTable status={status} pageSize={pageSize} />
      </MockedProvider>
    </AuthProvider>
  );
}

describe('BooksTable', () => {
  it("render books with READ status in table", async () => {
    const {container} = renderMockTable('READ', 10, ['otis fay', "wallace d'amore"]);
    await screen.findByText("otis fay");
    expect(container.querySelectorAll("tr").length).toEqual(3);
    expect(container.querySelector("td")?.innerHTML).toContain('otis fay');
  });

  it("pressing Next should render next page", async () => {
    renderMockTable('READ', 2);
    await screen.findByText("otis fay")
    await act(() => {
      fireEvent.click(screen.getByTestId('next'));
    });
    expect(await screen.findByText("francisco corwin jr.")).toBeInTheDocument();
    expect(screen.queryByText("gayle dooley")).not.toBeInTheDocument();
  });

  it("pressing Next should not render next page if no more books", async () => {
    renderMockTable('READ', 6);
    await screen.findByText("otis fay")
    await act(() => {
      fireEvent.click(screen.getByTestId('next'));
    });
    expect(await screen.findByText("otis fay")).toBeInTheDocument();
  });

  it("should show 'no results' if no data", async () => {
    renderMockTable('READING', 5);
    await screen.findByText("otis fay")
    await act(() => {
      fireEvent.click(screen.getByTestId('next'));
    });
    expect(await screen.findByText(new RegExp("no results", "i"))).toBeInTheDocument();
  });

  it("pressing Add should navigate to add page", async () => {
    renderMockTable('READING', 5);
    await act(() => {
      fireEvent.click(screen.getByTestId('add'));
    });
    expect(mockRouter).toMatchObject({ 
      pathname: "/add",
    });
  });
});
