export default function SkeletonProfile() {
    return (
        <div className="size-full flex flex-col justify-center px-[22%] py-10 gap-8">
            <div className="flex flex-row gap-8">
                <div className="h-30 w-100 rounded-lg bg-gray-400 animate-pulse"/>
                <div className="h-30 w-100 rounded-lg bg-gray-400 animate-pulse"/>
            </div>
            <div className="size-full rounded-lg bg-gray-400 animate-pulse"/>
        </div>
    )
}
