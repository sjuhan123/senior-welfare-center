import { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import type { RoomData, RoomType } from '@common/shared';
import Card from '../../components/ui/Card';
import CardHeader from '../../components/ui/CardHeader';
import PrimaryButton from '../../components/ui/PrimaryButton';
import useUpdateRoom from '../../hooks/api/room/useUpdateRoom';
import TimeSelect from '../../components/ui/TimeSelect';
import RoomMemberList from './RoomMemberList';

const ROOM_TYPE_LABEL: Record<RoomType, string> = { notice: '공지방', chat: '이야기방', feed: '사진방' };

type Props = {
  welfareId: string;
  courseId: string;
  room: RoomData;
};

const RoomDetail = ({ welfareId, courseId, room }: Props) => {
  const [draftFrom, setDraftFrom] = useState(room.availableFrom ?? '09:00');
  const [draftTo, setDraftTo] = useState(room.availableTo ?? '18:00');

  useEffect(() => {
    setDraftFrom(room.availableFrom ?? '09:00');
    setDraftTo(room.availableTo ?? '18:00');
  }, [room._id, room.availableFrom, room.availableTo]);

  const { mutate: updateRoom, isPending: isSaving } = useUpdateRoom(welfareId, courseId);

  return (
    <Card>
      <CardHeader>{ROOM_TYPE_LABEL[room.type]}</CardHeader>

      <Section>
        <SectionLabel>이용 시간</SectionLabel>
        {room.type === 'notice' ? (
          <NoticeText>공지방은 언제나 볼 수 있습니다. 시간 제한은 이야기방·사진방에만 둡니다.</NoticeText>
        ) : (
          <TimeRow>
            <TimeSelect value={draftFrom} onChange={setDraftFrom} />
            <Tilde>~</Tilde>
            <TimeSelect value={draftTo} onChange={setDraftTo} />
            <PrimaryButton onClick={() => updateRoom({ roomId: room._id, availableFrom: draftFrom, availableTo: draftTo })} disabled={isSaving}>
              {isSaving ? '저장 중...' : '시간 저장'}
            </PrimaryButton>
          </TimeRow>
        )}
      </Section>

      <RoomMemberList welfareId={welfareId} room={room} />
    </Card>
  );
};

export default RoomDetail;

const Section = styled.div(({ theme }) => ({
  padding: '13px 18px',
  borderBottom: `1px solid ${theme.semantic.divider}`,
}));

const SectionLabel = styled.div(({ theme }) => ({
  fontSize: theme.fontSize.small,
  fontWeight: theme.font.weight.semibold,
  color: theme.semantic.textMuted,
  marginBottom: 8,
}));

const NoticeText = styled.p(({ theme }) => ({
  margin: 0,
  fontSize: theme.fontSize.body,
  color: theme.semantic.textSecondary,
}));

const TimeRow = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
});

const Tilde = styled.span(({ theme }) => ({
  color: theme.semantic.textMuted,
}));
