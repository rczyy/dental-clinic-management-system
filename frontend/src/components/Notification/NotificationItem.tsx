import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Link } from "react-router-dom";
dayjs.extend(relativeTime);

interface Props {
  notification: NotificationResponse;
}

export const NotificationItem = ({ notification }: Props): JSX.Element => {
  return (
    <Link
      to={notification.type === "Appointment" ? "/my-appointments" : "/"}
      className="flex"
    >
      <figure className="min-w-[3.5rem] h-14 rounded-full overflow-hidden">
        <img
          className="w-full h-full object-cover"
          src={notification.from.avatar}
          alt="Avatar"
        />
      </figure>
      <div className="flex flex-col flex-nowrap">
        <p className="text-sm">
          <span className="font-semibold">
            {notification.from.name.firstName} {notification.from.name.lastName}
          </span>{" "}
          <span>{notification.description}</span>
        </p>
        <p className="text-xs text-primary font-semibold">
          {dayjs(notification.createdAt).fromNow()}
        </p>
      </div>
    </Link>
  );
};
