import { ApiType, createReport } from "./report";
import axios from "axios";

const printReport = async function (): Promise<void> {
    const { data } = await axios.get("https://api.publicapis.org/entries");
    const filteredData = data.entries.filter((api: ApiType) => {
        return api.HTTPS !== false;
    });
    const sortedData = filteredData.sort((a: ApiType, b: ApiType) => {
        return a.API.localeCompare(b.API)
    })
    return createReport(sortedData);
}

printReport()
