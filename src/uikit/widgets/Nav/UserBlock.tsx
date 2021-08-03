import React from "react";
import styled from "styled-components";
import Button from "../../components/Button/Button";
import { useWalletModal } from "../WalletModal";
import { Login } from "../WalletModal/types";
import { MenuButton } from "./Buttons";
import Dark from "./icons/Dark";
import Light from "./icons/Light";

interface Props {
  isDark: boolean;
  toggleTheme: (isDark: boolean) => void;
  account?: string;
  closeNav: () => void;
  login: Login;
  logout: () => void;
}

const Container = styled.div`
  display: flex;
  align-items: center;
  order: 1;
  margin-bottom: 32px;
  margin-left: 40px;
  ${({ theme }) => theme.mediaQueries.nav} {
    order: 2;
    margin-bottom: 0;
    margin-left: 0;
  }
`;

const UserBlock: React.FC<Props> = ({ isDark, toggleTheme, account, closeNav, login, logout }) => {
  const { onPresentConnectModal, onPresentAccountModal } = useWalletModal(login, logout, account);
  const accountEllipsis = account ? `${account.substring(0, 4)}...${account.substring(account.length - 4)}` : null;
  return (
    <Container>
      <MenuButton onClick={() => toggleTheme(!isDark)}>
        {isDark ? <Light color="primary" /> : <Dark color="primary" />}
      </MenuButton>
      {account ? (
        <Button
          size="sm"
          variant="tertiary"
          onClick={() => {
            onPresentAccountModal();
            closeNav();
          }}
        >
          {accountEllipsis}
        </Button>
      ) : (
        <Button
          size="sm"
          onClick={() => {
            onPresentConnectModal();
            closeNav();
          }}
        >
          Connect
        </Button>
      )}
    </Container>
  );
};

export default UserBlock;
