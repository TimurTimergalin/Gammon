import styled from "styled-components";
import {MessagesQueue} from "./MessageQueue";

export const MessagesOverlay = styled(MessagesQueue)`
    position: fixed;
    bottom: 10px;
    right: 10px;
    width: calc(100vw - 2 * 10px);
    max-width: 400px;
`