import React from "react";
import styled from "styled-components";
import { CloseIcon } from "../../components/Svg";
import UserBlock from "./UserBlock";
import PancakePrice from "./PancakePrice";
import { MobileOnlyButton } from "./Buttons";
import { NavProps } from "./types";

interface Props extends NavProps {
  links: NavProps["links"];
  show: boolean;
  closeNav: () => void;
}

const StyledPanel = styled.div<{ show: boolean }>`
  position: fixed;
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.nav.background};
  top: 0;
  right: ${({ show }) => (show ? 0 : "-100%")};
  width: 100%;
  max-width: 320px;
  height: 100vh;
  padding: 32px 0;
  overflow-y: auto;
  transition: right 0.4s;
  z-index: 11;
  ${({ theme }) => theme.mediaQueries.nav} {
    position: unset;
    max-width: unset;
    overflow-y: unset;
    z-index: unset;
    padding: 0;
    justify-content: space-between;
    flex-direction: row;
    height: 100%;
  }
`;

const LinkBlock = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  order: 2;
  margin-bottom: 32px;
  ${({ theme }) => theme.mediaQueries.nav} {
    order: 1;
    margin-bottom: 0;
    flex-direction: row;
  }

  .link {
    cursor: pointer;
    display: flex;
    align-items: center;
    width: 100%;
    min-height: 40px;
    padding: 8px 40px;
    font-weight: 600;
    transition: background-color 0.2s;
    color: ${({ theme }) => theme.colors.primary};
    :hover {
      background-color: ${({ theme }) => theme.nav.hover};
    }
    ${({ theme }) => theme.mediaQueries.nav} {
      height: 100%;
      padding: 0 12px;
    }
  }
`;

const Panel: React.FC<Props> = ({
  links,
  show,
  account,
  closeNav,
  login,
  logout,
  isDark,
  toggleTheme,
  langs,
  setLang,
  currentLang,
  btcPriceUsd,
}) => {
  return (
    <StyledPanel show={show}>
      <MobileOnlyButton
        onClick={closeNav}
        aria-label="Close the menu"
        style={{ position: "absolute", top: "5px", right: "5px" }}
      >
        <CloseIcon />
      </MobileOnlyButton>
      <LinkBlock>
        <PancakePrice btcPriceUsd={btcPriceUsd} />
      </LinkBlock>
      <UserBlock isDark={isDark} toggleTheme={toggleTheme} account={account} closeNav={closeNav} login={login} logout={logout} />
    </StyledPanel>
  );
};

export default Panel;
