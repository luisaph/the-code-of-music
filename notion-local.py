import os
from narkdown.exporter import NotionExporter

if __name__ == "__main__":
    token = "3b70a16f665648a3c544e8c7372a30f08e10ce355553f7b83f9d519f43575a2ac6a371bd03e2639e4d3070d2516a324d3c948278443e4af7256646609cda5410bffaaf3bad1aa4bef4b8f2fb8881"
    # page_url = "NOTION_PAGE_URL"
    database_url = "https://www.notion.so/4081964150024719ac433b4dd0b770fa"
    docs_directory = "./notion-docs"

    notion_exporter = NotionExporter(token, docs_directory)
    # notion_exporter.get_notion_page(page_url)
    notion_exporter.get_notion_pages_from_database(database_url)