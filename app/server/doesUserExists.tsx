import { getPostgresDatabaseManager} from "~/common--database-manager--postgres/postgresDatabaseManager.server";
import { QueryResult } from "pg";
interface CustomError extends Error {
    // Define any custom properties here if needed
}

export async function doesUserExists(emailId: string): Promise<{ exists: boolean, employeeId?: string } | CustomError> {
    const postgresDatabaseManager = await getPostgresDatabaseManager(null);
    if (postgresDatabaseManager instanceof Error) {
        return postgresDatabaseManager as CustomError;
    }

    try {
        const result: QueryResult<any> = await postgresDatabaseManager.execute(
            `
                SELECT
                    COUNT(*) as count,
                    employee_id
                FROM
                    employees
                WHERE
                    email_address = $1
            `,
            [emailId],
        );

        if (result instanceof Error) {
            return result as CustomError;
        }

        if (result.rowCount === 0) {
            return { exists: false };
        }

        // Extracting employee_id from the first row of the result
        const { count, employee_id } = result.rows[0];
        const exists = count > 0;
        console.log(emailId);
        return { exists, employeeId: exists ? employee_id : undefined };
    } catch (error) {
        return error as CustomError;
    }
}
