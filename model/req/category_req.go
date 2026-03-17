package req

type CategoryCreateReq struct {
	Name      string  `json:"name" binding:"required,max=50"`
	Color     *string `json:"color"`
	Icon      *string `json:"icon"`
	SortOrder *int    `json:"sort_order"`
}

type CategoryUpdateReq struct {
	Name      *string `json:"name" binding:"omitempty,max=50"`
	Color     *string `json:"color"`
	Icon      *string `json:"icon"`
	SortOrder *int    `json:"sort_order"`
}
