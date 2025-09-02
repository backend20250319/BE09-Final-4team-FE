import React from "react";
import { createChatBotMessage, createClientMessage } from "react-chatbot-kit";

// Type definitions
interface ChatBotMessage {
  id: number;
  message: string;
  type: "bot" | "user";
  [key: string]: any;
}

interface State {
  messages: ChatBotMessage[];
  [key: string]: any;
}

interface ActionProviderConstructor {
  createChatBotMessage: (message: string, options?: any) => ChatBotMessage;
  setState: (updater: (prevState: State) => State) => void;
  createClientMessage: (message: string, options?: any) => ChatBotMessage;
  stateRef: React.MutableRefObject<State>;
  createCustomMessage: (message: string, options?: any) => ChatBotMessage;
}

class ActionProvider {
  private createChatBotMessage: (
    message: string,
    options?: any
  ) => ChatBotMessage;
  private setState: (updater: (prevState: State) => State) => void;
  private createClientMessage: (
    message: string,
    options?: any
  ) => ChatBotMessage;
  private stateRef: React.MutableRefObject<State>;
  private createCustomMessage: (
    message: string,
    options?: any
  ) => ChatBotMessage;

  constructor(
    createChatBotMessage: (message: string, options?: any) => ChatBotMessage,
    setState: (updater: (prevState: State) => State) => void,
    createClientMessage: (message: string, options?: any) => ChatBotMessage,
    stateRef: React.MutableRefObject<State>,
    createCustomMessage: (message: string, options?: any) => ChatBotMessage
  ) {
    this.createChatBotMessage = createChatBotMessage;
    this.setState = setState;
    this.createClientMessage = createClientMessage;
    this.stateRef = stateRef;
    this.createCustomMessage = createCustomMessage;
  }

  greet = (): void => {
    const message = this.createChatBotMessage(
      "안녕하세요! 저는 업무를 도와드리는 AI 어시스턴트입니다. 무엇을 도와드릴까요?"
    );
    this.addMessageToState(message);
  };

  handleHelp = (): void => {
    const message = this.createChatBotMessage(
      "다음과 같은 기능들을 도와드릴 수 있습니다:\n\n" +
        "• 📅 일정 관리 및 캘린더 확인\n" +
        "• 👥 직원 관리 및 팀원 정보\n" +
        "• 📄 문서 관리 및 업로드\n" +
        "• 🏖️ 휴가 신청 및 관리\n" +
        "• ✅ 승인 프로세스\n" +
        "• ⚙️ 시스템 설정\n" +
        "• 🌤️ 날씨 정보\n" +
        "• 🕐 현재 시간\n\n" +
        "어떤 기능에 대해 궁금하신가요?"
    );
    this.addMessageToState(message);
  };

  handleWeather = (): void => {
    const message = this.createChatBotMessage(
      "오늘 서울의 날씨는 맑고 기온은 22°C입니다. 🌤️\n\n" +
        "외출하실 때는 가벼운 겉옷을 챙기시는 것을 추천드려요!"
    );
    this.addMessageToState(message);
  };

  handleTime = (): void => {
    const now = new Date();
    const timeString = now.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    const dateString = now.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    });

    const message = this.createChatBotMessage(
      `현재 시간은 ${timeString}입니다. 📅\n\n` + `오늘은 ${dateString}입니다.`
    );
    this.addMessageToState(message);
  };

  handleThanks = (): void => {
    const message = this.createChatBotMessage(
      "천만에요! 언제든지 도움이 필요하시면 말씀해 주세요. 😊"
    );
    this.addMessageToState(message);
  };

  handleTask = (): void => {
    const message = this.createChatBotMessage(
      "업무 관리에 대해 도와드릴게요! 📋\n\n" +
        "• 새로운 작업 등록\n" +
        "• 진행 중인 작업 확인\n" +
        "• 작업 완료 처리\n" +
        "• 팀원과의 작업 공유\n\n" +
        "어떤 업무를 도와드릴까요?"
    );
    this.addMessageToState(message);
  };

  handleSchedule = (): void => {
    const message = this.createChatBotMessage(
      "일정 관리 기능입니다! 📅\n\n" +
        "• 오늘의 일정 확인\n" +
        "• 새로운 일정 등록\n" +
        "• 일정 수정 및 삭제\n" +
        "• 팀 일정 공유\n" +
        "• 캘린더 뷰 전환\n\n" +
        "어떤 일정 관련 기능을 사용하시겠어요?"
    );
    this.addMessageToState(message);
  };

  handleMembers = (): void => {
    const message = this.createChatBotMessage(
      "직원 관리 기능입니다! 👥\n\n" +
        "• 전체 직원 목록 확인\n" +
        "• 직원 정보 조회\n" +
        "• 새로운 직원 등록\n" +
        "• 직원 정보 수정\n" +
        "• 조직도 확인\n\n" +
        "어떤 직원 관련 기능을 사용하시겠어요?"
    );
    this.addMessageToState(message);
  };

  handleDocuments = (): void => {
    const message = this.createChatBotMessage(
      "문서 관리 기능입니다! 📄\n\n" +
        "• 문서 업로드\n" +
        "• 문서 목록 확인\n" +
        "• 문서 검색\n" +
        "• 문서 다운로드\n" +
        "• 문서 공유\n\n" +
        "어떤 문서 관련 기능을 사용하시겠어요?"
    );
    this.addMessageToState(message);
  };

  handleVacation = (): void => {
    const message = this.createChatBotMessage(
      "휴가 관리 기능입니다! 🏖️\n\n" +
        "• 휴가 신청\n" +
        "• 휴가 일정 확인\n" +
        "• 휴가 승인 상태 확인\n" +
        "• 휴가 취소\n" +
        "• 휴가 통계\n\n" +
        "어떤 휴가 관련 기능을 사용하시겠어요?"
    );
    this.addMessageToState(message);
  };

  handleApproval = (): void => {
    const message = this.createChatBotMessage(
      "승인 프로세스 기능입니다! ✅\n\n" +
        "• 승인 대기 문서 확인\n" +
        "• 승인 처리\n" +
        "• 반려 처리\n" +
        "• 승인 이력 조회\n" +
        "• 승인 권한 설정\n\n" +
        "어떤 승인 관련 기능을 사용하시겠어요?"
    );
    this.addMessageToState(message);
  };

  handleSettings = (): void => {
    const message = this.createChatBotMessage(
      "시스템 설정 기능입니다! ⚙️\n\n" +
        "• 회사 정보 설정\n" +
        "• 근무 정책 설정\n" +
        "• 알림 설정\n" +
        "• 보안 설정\n" +
        "• 사용자 프로필 설정\n\n" +
        "어떤 설정을 변경하시겠어요?"
    );
    this.addMessageToState(message);
  };

  handleUnknown = (): void => {
    const message = this.createChatBotMessage(
      "죄송합니다. 이해하지 못했어요. 😅\n\n" +
        "다음과 같은 키워드로 질문해 주세요:\n" +
        "• 도움말, 일정, 직원, 문서\n" +
        "• 휴가, 승인, 설정, 날씨, 시간\n\n" +
        "또는 '도움'이라고 말씀해 주시면 사용 가능한 기능을 알려드릴게요!"
    );
    this.addMessageToState(message);
  };

  addMessageToState = (message: ChatBotMessage): void => {
    this.setState((prevState) => ({
      ...prevState,
      messages: [...prevState.messages, message],
    }));
  };
}

export default ActionProvider;
