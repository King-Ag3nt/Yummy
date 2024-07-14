export function showSearch() {
  MainRow.innerHTML = `
      <div class="col-md-6 px-3">
            <input type="text" class="form-control" placeholder="Search By Name">
          </div>
          <div class="col-md-6 px-3">
            <input type="text" class="form-control" placeholder="Search By Frist Letter">
          </div>
      `;
}
