import { Pane, Text, StatusIndicator, majorScale } from 'evergreen-ui'
import { useReadyState } from '../hooks/wsReadyState';

export function ConnectionIndicator ({ whiteboardId }: { whiteboardId: string} ) {
    const readyState = useReadyState();
    let statusColor: string

    switch (readyState) {
        case "Connected":
            statusColor = "success"
            break;
        case "Connecting":
            statusColor = ""
            break;
        default:
            statusColor = "danger"
    }

    return (
        <Pane marginTop={majorScale(1)}>
            <StatusIndicator color={statusColor}>{readyState}</StatusIndicator>
            <Text>: {whiteboardId}</Text>
        </Pane>
    )
}