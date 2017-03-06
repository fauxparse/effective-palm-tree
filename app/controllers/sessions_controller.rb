class SessionsController < Clearance::SessionsController
  def show
    respond_to do |format|
      format.json do
        if signed_in?
          render json: current_user, include: { memberships: :group }
        else
          head :unauthorized
        end
      end
    end
  end

  def create
    sleep 1
    @user = authenticate(params)

    respond_to do |format|
      sign_in(@user) do |status|
        if status.success?
          format.html { redirect_back_or url_after_create }
          format.json { render json: current_user }
        else
          message = status.failure_message
          format.html do
            flash.now = message
            render template: 'sessions/new', status: :unauthorized
          end
          format.json { render json: { error: message }, status: :unauthorized }
        end
      end
    end
  end

  def destroy
    sign_out
    respond_to do |format|
      format.html { redirect_to url_after_destroy }
      format.json { head :ok }
    end
  end
end
