import styles from "@/app/page.module.css";

export default function ChatNotFound() {
    return (
        <div className={styles.assistantInteraction}>
            <div className="w-full h-full rounded-lg shadow-lg flex flex-col">
                    <div className="flex-grow flex flex-col items-center justify-center">
                    <h1 className="text-9xl tracking-wide font-bold text-indigo-800">404</h1>
                        <h2 className="text-3xl font-medium text-indigo-800">Chat Not Found</h2>
                    </div>
            </div>
        </div>
        
    );
}