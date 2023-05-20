import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing";
import { AuthProvider } from "~/hooks/auth";
import { User } from "~/prisma/generated/type-graphql";

import { mocks } from '../../__mocks__/gql-mocks';

import { BooksTable  } from '../books';

jest.mock('next/router', () => require('next-router-mock'));

const mockUser: User = {
  id: 1,
  name: 'Bob',
  email: 'bob@alice.com',
}

it("render books with READ status in table", async () => {
  render(
    <AuthProvider initialUser={mockUser}>
      <MockedProvider mocks={mocks} addTypename={true}>
        <BooksTable status="READ" />
      </MockedProvider>
    </AuthProvider>
  );
  expect(await screen.findByText("otis fay")).toBeInTheDocument();
  expect(await screen.findByText("3/19/2023")).toBeInTheDocument();
});
