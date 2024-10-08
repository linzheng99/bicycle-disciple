import { UserAvatar } from "~/layout/User";
import { useUserStore } from "~/store";

export function Profile() {
  const store = useUserStore()
  return (
    <div className="flex size-full flex-col space-y-4 lg:flex-row">
      <div className="py-20 sm:px-40 lg:my-20 ">
        <div className="center flex-col gap-4 p-4">
          <UserAvatar />
          <span>
            {store.user?.name}
          </span>
        </div>
      </div>
      <div className="grow rounded-xl border p-4 shadow" />
    </div>
  )
}
