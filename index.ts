import axios from "axios";
const { Workbook } = require("excel4node");

type ApiType = {
    API: string,
    Description: string,
    Auth: string,
    HTTPS: boolean,
    Cors: string,
    Link: string,
    Category: string,
};

const main = async function (): Promise<void> {
    const apiData = await getData();
    generateData(apiData);
}

const getData = async function (): Promise<ApiType[]> {
    try {
        const { data } = await axios.get("https://api.publicapis.org/entries");
        const filteredData = data.entries.filter((api: ApiType) => {
            return api.HTTPS !== false;
        });
        return filteredData.sort((a: ApiType, b: ApiType) => {
            return a.API.localeCompare(b.API)
        })
    } catch (err) {
        throw new Error("Failed to get data");
    }
}

const generateData = function (apiData: ApiType[]): void {
    try {
        const wb = new Workbook;
        const ws = wb.addWorksheet('Report');

        const styleBorder = {
            left: {
                style: 'thin',
                color: '#050505',
            },
            right: {
                style: 'thin',
                color: '#050505',
            },
            top: {
                style: 'thin',
                color: '#050505',
            },
            bottom: {
                style: 'thin',
                color: '#050505',
            },
        }

        const headStyle = wb.createStyle({
            font: {
                size: 14,
            },
            fill: {
                type: "pattern",
                patternType: "solid",
                fgColor: '#00ffff',
            },
            border: styleBorder,
        });

        const style = wb.createStyle({
            font: {
                color: '#050505',
                size: 12,
            },
            border: styleBorder,
        });

        const apiKeys = Object.keys(apiData[0]);

        apiKeys.forEach((key: string, keyIndex: number) => {
            ws.cell(1, keyIndex+1)
                .string(key)
                .style(headStyle);
        });

        apiData.forEach((api: ApiType, apiIndex: number) => {
            ws.cell(2+apiIndex, 1)
                .string(api.API)
                .style(style);
            ws.cell(2+apiIndex, 2)
                .string(api.Description)
                .style(style);
            ws.cell(2+apiIndex, 3)
                .string(api.Auth)
                .style(style);
            ws.cell(2+apiIndex, 4)
                .bool(api.HTTPS)
                .style(style);
            ws.cell(2+apiIndex, 5)
                .string(api.Cors)
                .style(style);
            ws.cell(2+apiIndex, 6)
                .link(api.Link)
                .style(style);
            ws.cell(2+apiIndex, 7)
                .string(api.Category)
                .style(style);
        });
        wb.write("report.xls");
    } catch (err) {
        throw new Error("Failed to generate excel file");
    }
};

main();
